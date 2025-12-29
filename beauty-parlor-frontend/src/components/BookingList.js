export default function BookingList({ bookings, cancelBooking }) {
  return (
    <div>
      <h3>Your Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              {b.service} on {b.date}{" "}
              {cancelBooking && (
                <button onClick={() => cancelBooking(b.id)}>Cancel</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
