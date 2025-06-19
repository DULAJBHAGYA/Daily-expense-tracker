const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./utils/db');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

module.exports = app;
