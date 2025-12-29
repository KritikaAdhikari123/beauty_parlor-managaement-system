import React, { useState, useEffect } from "react";
import { getServices, getStaffByService, createAppointment } from "../api/appointments";

const AppointmentForm = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch all services on component load
  useEffect(() => {
    getServices().then((res) => setServices(res));
  }, []);

  // Fetch staff whenever a service is selected
  useEffect(() => {
    if (selectedService) {
      getStaffByService(selectedService).then((res) => setStaff(res));
      setSelectedStaff(""); // reset staff selection
    }
  }, [selectedService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedStaff || !selectedDate) {
      alert("Please select a service, staff, and date!");
      return;
    }

    const response = await createAppointment({
      serviceId: selectedService,
      staffId: selectedStaff,
      date: selectedDate,
    });

    if (response.success) {
      alert("Appointment booked successfully!");
      setSelectedService("");
      setSelectedStaff("");
      setSelectedDate("");
    } else {
      alert("Error booking appointment. Try again.");
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Service Selection */}
        <div>
          <label>Choose Service:</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">-- Select Service --</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.service_name}
              </option>
            ))}
          </select>
        </div>

        {/* Staff Selection */}
        <div>
          <label>Choose Staff:</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            disabled={!staff.length}
          >
            <option value="">-- Select Staff --</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label>Choose Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;

