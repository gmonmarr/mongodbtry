const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  logoUrl: String,
  propietario: {
    nombre: String,
    RFC: String,
    contacto: {
      telefono: String,
      email: String
    }
  },
  recinto: {
    nombre: String,
    aforo: Number,
    admisionNumerada: Boolean,
    ubicacion: {
      calle: String,
      ciudad: String,
      estado: String,
      pais: String,
      cp: String
    }
  },
  fechas: [
    {
      fecha: Date,
      hora: String,
      admisiones: [
        {
          nombre: String,
          precio: Number,
          urlLogo: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Event', eventSchema);
