const mongoose = require('mongoose');

const teacher = new mongoose.Schema(
  {
    teacher_id: {
      type: String,
      require: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      maxlength: 50
    },

    email: {
      type: String,
      require: true,
      trim: true
    },

    password: {
      type: String,
      require: true,
      trim: true,
      minlength: 8
    },

    contact: {
      type: String,
      require: true,
      trim: true,
      minlength: 10
    },
    role: {
      type: String,
      default: 'teacher'
    }
  },
  { timestamps: true }
);

const Teacher = mongoose.model('Teacher', teacher);

module.exports = Teacher;
