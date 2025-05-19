const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('../src/models/Event');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

const readAllEvents = async () => {
  const start = Date.now();

  const events = await Event.find({}).lean(); // lean() skips hydration for speed

  const end = Date.now();

  console.log(`✅ Read ${events.length} events`);
  console.log(`⏱️  Time taken: ${end - start} ms (${((end - start) / 1000).toFixed(2)} seconds)`);

  process.exit();
};

const run = async () => {
  await connectDB();
  await readAllEvents();
};

run();
