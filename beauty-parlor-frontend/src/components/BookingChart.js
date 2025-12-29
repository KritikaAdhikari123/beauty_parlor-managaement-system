import { Bar } from "react-chartjs-2";

export default function BookingChart({ bookings }) {
  const data = {
    labels: bookings.map(b => b.date),
    datasets: [
      {
        label: "Appointments",
        data: bookings.map(() => 1),
        backgroundColor: "#d63384",
      },
    ],
  };

  return <Bar data={data} />;
}
