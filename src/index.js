const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

// MongoDB routes
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const saleRoutes = require('./routes/sales');
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sales', saleRoutes);

// MySQL routes
const mysqlEventRoutes = require('./routes/events.mysql');
const mysqlSaleRoutes = require('./routes/sales.mysql');
app.use('/api/mysql/events', mysqlEventRoutes);
app.use('/api/mysql/sales', mysqlSaleRoutes);

// Connect to MongoDB and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
