const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/database.js');

app.use(express.json());
app.use(cookieParser());
connectDatabase();

const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;