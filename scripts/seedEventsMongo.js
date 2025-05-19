const mongoose = require('mongoose');
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const Event = require('../src/models/Event');

const NUM_EVENTS = parseInt(process.argv[2]) || 30;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

const seedEvents = async () => {
  console.log(`🧪 Seeding ${NUM_EVENTS} events...`);

  const startTime = Date.now();
  await Event.deleteMany();

  const events = [];

  for (let i = 0; i < NUM_EVENTS; i++) {
    const event = {
      nombre: faker.music.songName() + ' Live',
      logoUrl: faker.image.urlLoremFlickr({ category: 'concert' }),
      propietario: {
        nombre: faker.company.name(),
        RFC: faker.string.alphanumeric(13).toUpperCase(),
        contacto: {
          telefono: faker.phone.number('+52 81 ### ####'),
          email: faker.internet.email()
        }
      },
      recinto: {
        nombre: faker.company.name() + ' Arena',
        aforo: faker.number.int({ min: 500, max: 10000 }),
        admisionNumerada: faker.datatype.boolean(),
        ubicacion: {
          calle: faker.location.streetAddress(),
          ciudad: faker.location.city(),
          estado: faker.location.state(),
          pais: 'México',
          cp: faker.location.zipCode()
        }
      },
      fechas: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
        fecha: faker.date.future(),
        hora: `${faker.number.int({ min: 18, max: 22 })}:00`,
        admisiones: [
          {
            nombre: 'General',
            precio: faker.number.int({ min: 500, max: 1500 }),
            urlLogo: faker.image.avatar()
          },
          {
            nombre: 'VIP',
            precio: faker.number.int({ min: 1500, max: 3500 }),
            urlLogo: faker.image.avatar()
          }
        ]
      }))
    };

    events.push(event);
  }

  await Event.insertMany(events);
  const endTime = Date.now();

  console.log(`✅ Inserted ${NUM_EVENTS} events.`);
  console.log(`⏱️  Time taken: ${(endTime - startTime)} ms (${((endTime - startTime) / 1000).toFixed(2)} seconds)`);

  process.exit();
};

const run = async () => {
  await connectDB();
  await seedEvents();
};

run();
