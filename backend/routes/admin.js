const express = require('express');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Dashboard stats
router.get('/dashboard', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Total bookings
    const [totalBookings] = await db.execute(
      'SELECT COUNT(*) as count FROM bookings'
    );

    // Upcoming appointments
    const [upcoming] = await db.execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE status = 'CONFIRMED' AND booking_date >= CURDATE()`
    );

    // Cancelled appointments
    const [cancelled] = await db.execute(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE status = 'CANCELLED'`
    );

    // Recent bookings
    const [recentBookings] = await db.execute(
      `SELECT b.*, s.name as service_name, s.price_npr, u.name as user_name, u.email as user_email,
              st.name as stylist_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN staff st ON b.stylist_id = st.id
       ORDER BY b.created_at DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        totalBookings: totalBookings[0].count,
        upcomingAppointments: upcoming[0].count,
        cancelledAppointments: cancelled[0].count,
        recentBookings: recentBookings
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
});

// Get all appointments
router.get('/appointments', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = `SELECT b.*, s.name as service_name, s.description, s.price_npr, s.duration,
                        u.name as user_name, u.email as user_email
                 FROM bookings b
                 JOIN services s ON b.service_id = s.id
                 JOIN users u ON b.user_id = u.id`;
    
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('b.status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('b.booking_date = ?');
      params.push(date);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY b.booking_date DESC, b.time_slot DESC';

    const [appointments] = await db.execute(query, params);
    
    // Include stylist information
    const appointmentsWithStylist = await Promise.all(
      appointments.map(async (apt) => {
        if (apt.stylist_id) {
          const [stylists] = await db.execute(
            'SELECT name FROM staff WHERE id = ?',
            [apt.stylist_id]
          );
          apt.stylist_name = stylists.length > 0 ? stylists[0].name : null;
        }
        return apt;
      })
    );
    
    res.json({ success: true, data: appointmentsWithStylist });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
});

// Get booking history
router.get('/booking-history', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, s.name as service_name, s.price_npr, u.name as user_name, u.email as user_email
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    );

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get booking history error:', error);
    res.status(500).json({ success: false, message: 'Error fetching booking history' });
  }
});

module.exports = router;

