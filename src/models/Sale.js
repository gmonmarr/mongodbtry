const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evento_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  fecha: { type: Date, required: true },
  hora: String,
  boletos: [
    {
      fecha_evento: Date,
      zona: String,
      precio: Number,
      cantidad: Number,
      qrs: [
        {
          codigo_qr: String,
          validado: { type: Boolean, default: false }
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Sale', saleSchema);