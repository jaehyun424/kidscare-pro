// ============================================
// KidsCare Pro - Cloud Functions
// ============================================

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

// ----------------------------------------
// onBookingCreated: Notify hotel when a new booking is created
// ----------------------------------------
export const onBookingCreated = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const booking = snapshot.data();
    const hotelId = booking.hotelId;

    if (!hotelId) return;

    // Create notification for hotel staff
    await db.collection("notifications").add({
      userId: hotelId, // Hotel staff will query by hotelId
      type: "booking_created",
      title: "New Booking Received",
      body: `New booking ${booking.confirmationCode || ""} for room ${booking.location?.roomNumber || "N/A"}.`,
      data: {
        bookingId: event.params.bookingId,
        hotelId,
      },
      read: false,
      createdAt: new Date(),
    });
  }
);

// ----------------------------------------
// onSessionCompleted: Notify parent to leave a review
// ----------------------------------------
export const onSessionCompleted = onDocumentCreated(
  "sessions/{sessionId}",
  async (event) => {
    // This triggers on creation, so we use onDocumentUpdated-like logic
    // by checking if status is 'completed'
    const snapshot = event.data;
    if (!snapshot) return;

    const session = snapshot.data();

    if (session.status !== "completed") return;

    const parentId = session.parentId;
    if (!parentId) return;

    await db.collection("notifications").add({
      userId: parentId,
      type: "care_completed",
      title: "Care Session Complete",
      body: "Your care session has been completed. Please leave a review for your sitter.",
      data: {
        sessionId: event.params.sessionId,
        bookingId: session.bookingId || "",
      },
      read: false,
      createdAt: new Date(),
    });
  }
);
