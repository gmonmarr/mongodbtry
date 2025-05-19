const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');

// Get all sales
router.get('/', async (req, res) => {
  const sales = await Sale.find().populate('usuario_id evento_id');
  res.json(sales);
});

// Get sale by ID
router.get('/:id', async (req, res) => {
  const sale = await Sale.findById(req.params.id).populate('usuario_id evento_id');
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
});

// Create new sale
router.post('/', async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.status(201).json(sale);
});

// Validate ticket (example: mark QR as used)
router.post('/validate/:qr', async (req, res) => {
  const qr = req.params.qr;
  const sale = await Sale.findOne({ "boletos.qrs.codigo_qr": qr });

  if (!sale) return res.status(404).json({ message: 'QR not found' });

  // Validate the specific QR code
  for (const b of sale.boletos) {
    for (const q of b.qrs) {
      if (q.codigo_qr === qr) {
        if (q.validado) return res.status(400).json({ message: 'QR already validated' });
        q.validado = true;
      }
    }
  }

  await sale.save();
  res.json({ message: 'QR validated' });
});

module.exports = router;
