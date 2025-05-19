const express = require('express');
const router = express.Router();
const pool = require('../config/mysql');

// GET all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_evento');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET one event by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_evento WHERE idEvento = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
