require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');

const { PORT = 5000, MONGODB_URI, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN.split(',').map((s) => s.trim()) }));
app.use(express.json());

// Connect lazily and reuse the connection (needed for serverless)
let connection;
function connectDB() {
  if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');
  if (!connection) {
    connection = mongoose.connect(MONGODB_URI).catch((err) => {
      connection = null;
      throw err;
    });
  }
  return connection;
}
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/', (_req, res) => res.json({ ok: true, name: 'taskboard api' }));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/tasks', tasks);

app.use((err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

module.exports = app;

// Only start a listener when running locally (npm run dev), not on Vercel
if (require.main === module) {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}