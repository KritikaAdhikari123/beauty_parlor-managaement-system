const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Get feedback (public, but can filter by service)
router.get('/', async (req, res) => {
  try {
    const { service_id } = req.query;
    let query = `
      SELECT f.*, u.name as user_name, s.name as service_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      LEFT JOIN services s ON f.service_id = s.id
      WHERE f.is_visible = TRUE
    `;
    const params = [];

    if (service_id) {
      query += ' AND f.service_id = ?';
      params.push(service_id);
    }

    query += ' ORDER BY f.created_at DESC';

    const [feedback] = await db.execute(query, params);
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ success: false, message: 'Error fetching feedback' });
  }
});

// Create feedback (authenticated users)
router.post('/', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  body('service_id').optional().isInt(),
  body('booking_id').optional().isInt()
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

    const { rating, comment, service_id, booking_id } = req.body;
    const user_id = req.user.id;

    // If booking_id provided, verify it belongs to user
    if (booking_id) {
      const [bookings] = await db.execute(
        'SELECT service_id FROM bookings WHERE id = ? AND user_id = ?',
        [booking_id, user_id]
      );
      if (bookings.length === 0) {
        return res.status(403).json({ success: false, message: 'Booking not found or access denied' });
      }
      // Use service_id from booking if not provided
      const serviceIdFromBooking = bookings[0].service_id;
      const finalServiceId = service_id || serviceIdFromBooking;

      const [result] = await db.execute(
        'INSERT INTO feedback (user_id, booking_id, service_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [user_id, booking_id, finalServiceId, rating, comment || null]
      );

      const [feedback] = await db.execute(
        `SELECT f.*, u.name as user_name, s.name as service_name
         FROM feedback f
         JOIN users u ON f.user_id = u.id
         LEFT JOIN services s ON f.service_id = s.id
         WHERE f.id = ?`,
        [result.insertId]
      );

      return res.status(201).json({ success: true, data: feedback[0] });
    }

    // Without booking_id
    const [result] = await db.execute(
      'INSERT INTO feedback (user_id, service_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id, service_id || null, rating, comment || null]
    );

    const [feedback] = await db.execute(
      `SELECT f.*, u.name as user_name, s.name as service_name
       FROM feedback f
       JOIN users u ON f.user_id = u.id
       LEFT JOIN services s ON f.service_id = s.id
       WHERE f.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: feedback[0] });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ success: false, message: 'Error creating feedback' });
  }
});

// Get user's own feedback
router.get('/my-feedback', authenticate, async (req, res) => {
  try {
    const [feedback] = await db.execute(
      `SELECT f.*, s.name as service_name
       FROM feedback f
       LEFT JOIN services s ON f.service_id = s.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Get my feedback error:', error);
    res.status(500).json({ success: false, message: 'Error fetching feedback' });
  }
});

// Admin: Toggle feedback visibility
router.put('/:id/visibility', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { is_visible } = req.body;
    await db.execute(
      'UPDATE feedback SET is_visible = ? WHERE id = ?',
      [is_visible !== undefined ? is_visible : true, req.params.id]
    );
    res.json({ success: true, message: 'Feedback visibility updated' });
  } catch (error) {
    console.error('Update feedback visibility error:', error);
    res.status(500).json({ success: false, message: 'Error updating feedback visibility' });
  }
});

module.exports = router;

