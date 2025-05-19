const express = require('express');
const router = express.Router();
const pool = require('../config/mysql');

// GET all sales
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.idVenta, v.FechaVenta, v.HoraVenta, e.Nombre AS Evento
      FROM tbl_venta v
      JOIN tbl_evento e ON v.idEvento = e.idEvento
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Validate boleto (QR example)
router.post('/validate/:idVenta', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_admision_venta WHERE idVenta = ?', [req.params.idVenta]);
    if (rows.length === 0) return res.status(404).json({ message: 'Boleto no válido' });

    // Simulate validation update
    res.json({ message: 'Boleto válido (lógica de validación simulada)' });
  } catch (err) {
    console.error('Error validating ticket:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
