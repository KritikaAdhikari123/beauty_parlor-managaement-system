const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const [services] = await db.execute(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const [services] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );
    
    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    
    res.json({ success: true, data: services[0] });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Error fetching service' });
  }
});

// Create service (admin only)
router.post('/', authenticate, authorizeAdmin, [
  body('name').trim().notEmpty().withMessage('Service name required'),
  body('price_npr').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('duration').isInt({ min: 1 }).withMessage('Valid duration required')
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

    const { name, description, price_npr, duration, category, image_url } = req.body;

    const [result] = await db.execute(
      'INSERT INTO services (name, description, category, price_npr, duration, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, category || 'General', price_npr, duration, image_url || null]
    );

    const [service] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ success: true, data: service[0] });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
});

// Update service (admin only)
router.put('/:id', authenticate, authorizeAdmin, [
  body('name').optional().trim().notEmpty(),
  body('price_npr').optional().isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 1 })
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

    const { name, description, price_npr, duration, category, image_url } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (image_url !== undefined) { updates.push('image_url = ?'); values.push(image_url); }
    if (price_npr) { updates.push('price_npr = ?'); values.push(price_npr); }
    if (duration) { updates.push('duration = ?'); values.push(duration); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(req.params.id);

    await db.execute(
      `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [service] = await db.execute(
      'SELECT * FROM services WHERE id = ?',
      [req.params.id]
    );

    if (service.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service[0] });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
});

// Delete service (admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.execute(
      'DELETE FROM services WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
});

module.exports = router;

