const express = require('express');
const Task = require('../models/Task');

const router = express.Router();
const FIELDS = ['title', 'description', 'assignee', 'dueDate', 'status'];
const pick = (body) => Object.fromEntries(FIELDS.filter((k) => k in body).map((k) => [k, body[k]]));

// List all tasks (oldest first so new cards land at the bottom)
router.get('/', async (_req, res, next) => {
  try {
    res.json(await Task.find().sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Task.create(pick(req.body)));
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
