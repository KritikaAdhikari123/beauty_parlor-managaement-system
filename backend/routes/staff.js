const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all staff (public)
router.get('/', async (req, res) => {
  try {
    const [staff] = await db.execute(
      'SELECT * FROM staff WHERE is_active = TRUE ORDER BY name ASC'
    );
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Error fetching staff' });
  }
});

// Get single staff member
router.get('/:id', async (req, res) => {
  try {
    const [staff] = await db.execute(
      'SELECT * FROM staff WHERE id = ? AND is_active = TRUE',
      [req.params.id]
    );
    
    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    
    // Get working hours
    const [hours] = await db.execute(
      'SELECT * FROM staff_working_hours WHERE staff_id = ?',
      [req.params.id]
    );
    
    res.json({ 
      success: true, 
      data: { ...staff[0], working_hours: hours } 
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: 'Error fetching staff member' });
  }
});

// Create staff (admin only)
router.post('/', authenticate, authorizeAdmin, [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('specialization').optional().trim(),
  body('bio').optional().trim()
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

    const { name, email, phone, specialization, bio } = req.body;

    const [result] = await db.execute(
      'INSERT INTO staff (name, email, phone, specialization, bio) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, specialization || null, bio || null]
    );

    const [staff] = await db.execute(
      'SELECT * FROM staff WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: staff[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    console.error('Create staff error:', error);
    res.status(500).json({ success: false, message: 'Error creating staff member' });
  }
});

// Update staff (admin only)
router.put('/:id', authenticate, authorizeAdmin, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('specialization').optional().trim(),
  body('bio').optional().trim()
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

    const { name, email, phone, specialization, bio, is_active } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
    if (specialization !== undefined) { updates.push('specialization = ?'); values.push(specialization); }
    if (bio !== undefined) { updates.push('bio = ?'); values.push(bio); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);

    await db.execute(
      `UPDATE staff SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [staff] = await db.execute(
      'SELECT * FROM staff WHERE id = ?',
      [req.params.id]
    );

    if (staff.length === 0) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({ success: true, data: staff[0] });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ success: false, message: 'Error updating staff member' });
  }
});

// Delete staff (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Soft delete by setting is_active to false
    await db.execute(
      'UPDATE staff SET is_active = FALSE WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Staff member deactivated successfully' });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({ success: false, message: 'Error deactivating staff member' });
  }
});

// Set working hours (admin only)
router.post('/:id/working-hours', authenticate, authorizeAdmin, [
  body('day_of_week').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/),
  body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
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

    const { day_of_week, start_time, end_time, is_available } = req.body;
    const staffId = req.params.id;

    // Check if exists
    const [existing] = await db.execute(
      'SELECT id FROM staff_working_hours WHERE staff_id = ? AND day_of_week = ?',
      [staffId, day_of_week]
    );

    if (existing.length > 0) {
      // Update
      await db.execute(
        'UPDATE staff_working_hours SET start_time = ?, end_time = ?, is_available = ? WHERE id = ?',
        [start_time, end_time, is_available !== undefined ? is_available : true, existing[0].id]
      );
      const [updated] = await db.execute(
        'SELECT * FROM staff_working_hours WHERE id = ?',
        [existing[0].id]
      );
      return res.json({ success: true, data: updated[0] });
    } else {
      // Create
      const [result] = await db.execute(
        'INSERT INTO staff_working_hours (staff_id, day_of_week, start_time, end_time, is_available) VALUES (?, ?, ?, ?, ?)',
        [staffId, day_of_week, start_time, end_time, is_available !== undefined ? is_available : true]
      );
      const [newHour] = await db.execute(
        'SELECT * FROM staff_working_hours WHERE id = ?',
        [result.insertId]
      );
      return res.status(201).json({ success: true, data: newHour[0] });
    }
  } catch (error) {
    console.error('Set working hours error:', error);
    res.status(500).json({ success: false, message: 'Error setting working hours' });
  }
});

module.exports = router;

