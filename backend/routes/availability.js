const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Get availability for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    let query = 'SELECT * FROM availability WHERE service_id = ? AND is_available = TRUE';
    const params = [serviceId];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    } else {
      query += ' AND date >= CURDATE()';
    }

    query += ' ORDER BY date, time_slot';

    const [slots] = await db.execute(query, params);
    res.json({ success: true, data: slots });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ success: false, message: 'Error fetching availability' });
  }
});

// Set availability (admin only)
router.post('/', authenticate, authorizeAdmin, [
  body('service_id').isInt().withMessage('Valid service ID required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('time_slot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Valid time slot required (HH:MM:SS)'),
  body('is_available').isBoolean().withMessage('is_available must be boolean')
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

    const { service_id, date, time_slot, is_available } = req.body;

    // Check if slot exists
    const [existing] = await db.execute(
      'SELECT id FROM availability WHERE service_id = ? AND date = ? AND time_slot = ?',
      [service_id, date, time_slot]
    );

    if (existing.length > 0) {
      // Update existing
      await db.execute(
        'UPDATE availability SET is_available = ? WHERE id = ?',
        [is_available, existing[0].id]
      );
      const [updated] = await db.execute(
        'SELECT * FROM availability WHERE id = ?',
        [existing[0].id]
      );
      return res.json({ success: true, data: updated[0] });
    } else {
      // Create new
      const [result] = await db.execute(
        'INSERT INTO availability (service_id, date, time_slot, is_available) VALUES (?, ?, ?, ?)',
        [service_id, date, time_slot, is_available]
      );
      const [newSlot] = await db.execute(
        'SELECT * FROM availability WHERE id = ?',
        [result.insertId]
      );
      return res.status(201).json({ success: true, data: newSlot[0] });
    }
  } catch (error) {
    console.error('Set availability error:', error);
    res.status(500).json({ success: false, message: 'Error setting availability' });
  }
});

module.exports = router;

