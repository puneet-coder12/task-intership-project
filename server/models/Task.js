const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    assignee: { type: String, trim: true, maxlength: 60, default: '' },
    // Stored as "YYYY-MM-DD" so there are no timezone surprises
    dueDate: {
      type: String,
      default: '',
      validate: {
        validator: (v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v),
        message: 'Due date must be YYYY-MM-DD',
      },
    },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  },
  { timestamps: true }
);

taskSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  },
});

module.exports = mongoose.model('Task', taskSchema);
