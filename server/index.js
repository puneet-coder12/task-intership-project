require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');

const { PORT = 5000, MONGODB_URI, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Copy server/.env.example to server/.env and set it.');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN.split(',').map((s) => s.trim()) }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/tasks', tasks);

// Central error handler: validation / bad id => 400, everything else => 500
app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
