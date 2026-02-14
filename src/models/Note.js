const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200
    },

    content: {
      type: String,
      trim: true
    },

    completed: {
      type: Boolean,
      default: false
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    dueDate: {
      type: Date
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    userId: {
      type: String,
      required: true,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for performance
noteSchema.index({ userId: 1, isDeleted: 1 });

module.exports = mongoose.model('Note', noteSchema);
