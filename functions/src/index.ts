// ============================================
// KidsCare Pro - Cloud Functions
// ============================================

import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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
  return snapshot.docs.map((doc) => doc.id);
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
