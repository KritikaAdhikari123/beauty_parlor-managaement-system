const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Create booking
router.post('/', authenticate, [
  body('service_id').isInt().withMessage('Valid service ID required'),
  body('booking_date').isISO8601().withMessage('Valid booking date required'),
  body('time_slot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Valid time slot required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { service_id, booking_date, time_slot } = req.body;
    const user_id = req.user.id;

    // Check if slot is available
    const [availability] = await db.execute(
      'SELECT * FROM availability WHERE service_id = ? AND date = ? AND time_slot = ? AND is_available = TRUE',
      [service_id, booking_date, time_slot]
    );

    if (availability.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Time slot not available' 
      });
    }

    // Check for existing confirmed booking
    const [existing] = await db.execute(
      'SELECT id FROM bookings WHERE service_id = ? AND booking_date = ? AND time_slot = ? AND status = "confirmed"',
      [service_id, booking_date, time_slot]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Time slot already booked' 
      });
    }

    // Create booking
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, service_id, booking_date, time_slot, status) VALUES (?, ?, ?, ?, ?)',
      [user_id, service_id, booking_date, time_slot, 'confirmed']
    );

    // Mark slot as unavailable
    await db.execute(
      'UPDATE availability SET is_available = FALSE WHERE service_id = ? AND date = ? AND time_slot = ?',
      [service_id, booking_date, time_slot]
    );

    // Fetch complete booking details
    const [booking] = await db.execute(
      `SELECT b.*, s.name as service_name, s.price_npr, s.duration, u.name as user_name, u.email as user_email
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: booking[0] });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
});

// Get user bookings
router.get('/my-bookings', authenticate, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, s.name as service_name, s.description, s.price_npr, s.duration
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC, b.time_slot DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
});

// Cancel booking
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Get booking
    const [bookings] = await db.execute(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, req.user.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Check if booking is in the future
    const bookingDateTime = new Date(`${booking.booking_date} ${booking.time_slot}`);
    if (bookingDateTime <= new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel past bookings' 
      });
    }

    // Update booking status
    await db.execute(
      'UPDATE bookings SET status = "cancelled" WHERE id = ?',
      [bookingId]
    );

    // Mark slot as available again
    await db.execute(
      'UPDATE availability SET is_available = TRUE WHERE service_id = ? AND date = ? AND time_slot = ?',
      [booking.service_id, booking.booking_date, booking.time_slot]
    );

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
});

module.exports = router;

