import { useState } from "react";
import BookingList from "../components/BookingList";

export default function AdminPage() {
  // In real app, you would fetch all bookings from backend
  const [bookings] = useState([
    { id: 1, service: "Haircut", date: "2025-12-30", user: "user1@example.com" },
    { id: 2, service: "Facial", date: "2025-12-31", user: "user2@example.com" },
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <BookingList
        bookings={bookings.map((b) => ({ ...b, service: `${b.user} - ${b.service}` }))}
      />
    </div>
  );
}
