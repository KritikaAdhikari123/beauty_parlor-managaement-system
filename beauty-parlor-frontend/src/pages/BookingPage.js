import { useState } from "react";
import BookingForm from "../components/BookingForm";
import BookingList from "../components/BookingList";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => setBookings([...bookings, booking]);
  const cancelBooking = (id) =>
    setBookings(bookings.filter((b) => b.id !== id));

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      <BookingForm addBooking={addBooking} />
      <BookingList bookings={bookings} cancelBooking={cancelBooking} />
    </div>
  );
}

