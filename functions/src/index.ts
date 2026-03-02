// ============================================
// Petit Stay - Cloud Functions
// ============================================

import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// ----------------------------------------
// Helper: Create notification for a user
// ----------------------------------------
async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) {
  await db.collection("notifications").add({
    userId,
    type,
    title,
    body,
    data: data || {},
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  });
}

// ----------------------------------------
// Helper: Get hotel staff userIds for a hotel
// ----------------------------------------
async function getHotelStaffIds(hotelId: string): Promise<string[]> {
  const snapshot = await db
    .collection("users")
    .where("role", "==", "hotel_staff")
    .where("hotelId", "==", hotelId)
    .get();
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.id);
}

// ----------------------------------------
// onBookingCreated: Notify hotel staff when a new booking is created
// ----------------------------------------
export const onBookingCreated = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const booking = snapshot.data();
    const hotelId = booking.hotelId;
    if (!hotelId) return;

    const bookingId = event.params.bookingId;
    const code = booking.confirmationCode || "";
    const room = booking.location?.roomNumber || "N/A";

    // Notify all hotel staff for this hotel
    const staffIds = await getHotelStaffIds(hotelId);
    const notifyPromises = staffIds.map((staffId) =>
      createNotification(
        staffId,
        "booking_created",
        "New Booking Received",
        `New booking ${code} for Room ${room}.`,
        { bookingId, hotelId }
      )
    );

    // Also notify the parent that their booking was received
    if (booking.parentId) {
      notifyPromises.push(
        createNotification(
          booking.parentId,
          "booking_created",
          "Booking Submitted",
          `Your booking ${code} has been submitted and is pending confirmation.`,
          { bookingId, hotelId }
        )
      );
    }

    await Promise.all(notifyPromises);
  }
);

// ----------------------------------------
// onSessionCompleted: Notify parent to leave a review
// ----------------------------------------
export const onSessionCompleted = onDocumentUpdated(
  "sessions/{sessionId}",
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;

    // Only trigger when status changes TO 'completed'
    if (before.status === after.status || after.status !== "completed") return;

    const sessionId = event.params.sessionId;
    const parentId = after.parentId;
    const sitterId = after.sitterId;

    if (parentId) {
      await createNotification(
        parentId,
        "care_completed",
        "Care Session Complete",
        "Your care session has been completed. Please leave a review for your sitter.",
        { sessionId, bookingId: after.bookingId || "" }
      );
    }

    // Notify the sitter that the session is recorded as complete
    if (sitterId) {
      await createNotification(
        sitterId,
        "care_completed",
        "Session Completed",
        "Your care session has been recorded as complete.",
        { sessionId }
      );
    }
  }
);

// ----------------------------------------
// onIncidentCreated: Notify hotel and parent about an incident
// ----------------------------------------
export const onIncidentCreated = onDocumentCreated(
  "incidents/{incidentId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const incident = snapshot.data();
    const incidentId = event.params.incidentId;
    const hotelId = incident.hotelId;
    const parentId = incident.parentId;
    const severity = incident.severity || "low";
    const summary = incident.report?.summary || "An incident has been reported.";

    const severityEmoji =
      severity === "critical" ? "🚨" :
      severity === "high" ? "⚠️" :
      severity === "medium" ? "📋" : "ℹ️";

    // Notify hotel staff
    if (hotelId) {
      const staffIds = await getHotelStaffIds(hotelId);
      await Promise.all(
        staffIds.map((staffId) =>
          createNotification(
            staffId,
            "emergency",
            `${severityEmoji} Incident Report (${severity.toUpperCase()})`,
            summary,
            { incidentId, hotelId, severity }
          )
        )
      );
    }

    // Notify parent
    if (parentId) {
      await createNotification(
        parentId,
        "emergency",
        "Incident Report",
        summary,
        { incidentId, severity }
      );
    }
  }
);

// ----------------------------------------
// onBookingCancelled: Notify relevant parties
// ----------------------------------------
export const onBookingCancelled = onDocumentUpdated(
  "bookings/{bookingId}",
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!before || !after) return;

    // Only trigger when status changes TO 'cancelled'
    if (before.status === after.status || after.status !== "cancelled") return;

    const bookingId = event.params.bookingId;
    const code = after.confirmationCode || bookingId;
    const cancelledBy = after.cancellation?.cancelledBy || "system";

    const promises: Promise<void>[] = [];

    // Notify parent (unless they cancelled)
    if (after.parentId && cancelledBy !== "parent") {
      promises.push(
        createNotification(
          after.parentId,
          "booking_cancelled",
          "Booking Cancelled",
          `Your booking ${code} has been cancelled.`,
          { bookingId, cancelledBy }
        )
      );
    }

    // Notify sitter (if assigned)
    if (after.sitterId) {
      promises.push(
        createNotification(
          after.sitterId,
          "booking_cancelled",
          "Booking Cancelled",
          `Booking ${code} has been cancelled.`,
          { bookingId }
        )
      );
    }

    // Notify hotel staff (unless they cancelled)
    if (after.hotelId && cancelledBy !== "hotel") {
      const staffIds = await getHotelStaffIds(after.hotelId);
      staffIds.forEach((staffId) => {
        promises.push(
          createNotification(
            staffId,
            "booking_cancelled",
            "Booking Cancelled",
            `Booking ${code} has been cancelled by ${cancelledBy}.`,
            { bookingId, cancelledBy }
          )
        );
      });
    }

    await Promise.all(promises);
  }
);

// ----------------------------------------
// scheduledNoShowDetection: Detect no-show bookings every 15 minutes
// If a booking's scheduled start is 30+ minutes ago and no session started, mark as no_show
// ----------------------------------------
export const scheduledNoShowDetection = onSchedule(
  { schedule: "every 15 minutes", timeZone: "Asia/Seoul" },
  async () => {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

    // Find confirmed bookings with scheduled start before cutoff
    const bookingsSnap = await db
      .collection("bookings")
      .where("status", "==", "confirmed")
      .where("scheduledStart", "<=", cutoff)
      .get();

    if (bookingsSnap.empty) return;

    const batch = db.batch();
    const notifyPromises: Promise<void>[] = [];

    for (const bookingDoc of bookingsSnap.docs) {
      const booking = bookingDoc.data();

      // Check if a session exists for this booking
      const sessionSnap = await db
        .collection("sessions")
        .where("bookingId", "==", bookingDoc.id)
        .limit(1)
        .get();

      if (sessionSnap.empty) {
        // No session started — mark as no_show
        batch.update(bookingDoc.ref, {
          status: "no_show",
          updatedAt: FieldValue.serverTimestamp(),
        });

        // Notify hotel staff
        if (booking.hotelId) {
          const staffIds = await getHotelStaffIds(booking.hotelId);
          staffIds.forEach((staffId) => {
            notifyPromises.push(
              createNotification(
                staffId,
                "booking_cancelled",
                "No-Show Detected",
                `Booking ${booking.confirmationCode || bookingDoc.id} marked as no-show.`,
                { bookingId: bookingDoc.id, hotelId: booking.hotelId }
              )
            );
          });
        }
      }
    }

    await batch.commit();
    await Promise.all(notifyPromises);
  }
);

// ----------------------------------------
// onReviewCreated: Recalculate sitter average rating + notify sitter
// ----------------------------------------
export const onReviewCreated = onDocumentCreated(
  "reviews/{reviewId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const review = snapshot.data();
    const sitterId = review.sitterId;
    if (!sitterId) return;

    // Recalculate average rating
    const reviewsSnap = await db
      .collection("reviews")
      .where("sitterId", "==", sitterId)
      .get();

    let totalRating = 0;
    let count = 0;
    reviewsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
      const r = doc.data();
      if (typeof r.rating === "number") {
        totalRating += r.rating;
        count++;
      }
    });

    const averageRating = count > 0 ? Math.round((totalRating / count) * 10) / 10 : 0;

    // Update sitter document with new rating
    const sitterRef = db.collection("sitters").doc(sitterId);
    const sitterDoc = await sitterRef.get();

    if (sitterDoc.exists) {
      await sitterRef.update({
        rating: averageRating,
        reviewCount: count,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Notify the sitter about the new review
    const rating = review.rating || 0;
    const stars = "⭐".repeat(Math.min(rating, 5));
    await createNotification(
      sitterId,
      "review_received",
      "New Review Received",
      `You received a ${stars} (${rating}/5) review.`,
      { reviewId: event.params.reviewId, rating }
    );
  }
);

// ----------------------------------------
// scheduledCleanup: Daily cleanup of old read notifications (03:00 KST)
// Deletes read notifications older than 30 days, in batches of 500
// ----------------------------------------
export const scheduledCleanup = onSchedule(
  { schedule: "0 3 * * *", timeZone: "Asia/Seoul" },
  async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const query = db
      .collection("notifications")
      .where("read", "==", true)
      .where("createdAt", "<=", cutoff)
      .limit(500);

    let deleted = 0;
    let snapshot = await query.get();

    while (!snapshot.empty) {
      const batch = db.batch();
      snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      deleted += snapshot.docs.length;

      // Get next batch
      if (snapshot.docs.length < 500) break;
      snapshot = await query.get();
    }

    if (deleted > 0) {
      console.log(`scheduledCleanup: Deleted ${deleted} old read notifications.`);
    }
  }
);
