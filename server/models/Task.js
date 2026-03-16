const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  tag: {
    type: String,
    enum: ['work', 'personal', 'urgent'],
    default: 'personal'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
