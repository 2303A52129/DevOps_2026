const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      default: 'Full-time',
    },
    category: {
      type: String,
      enum: ['Technology', 'Finance', 'Marketing', 'Design', 'Sales', 'HR', 'Operations', 'Other'],
      default: 'Technology',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: String,
      maxlength: [3000, 'Requirements cannot exceed 3000 characters'],
    },
    salary: {
      type: String,
      default: 'Not disclosed',
    },
    skills: [{ type: String, trim: true }],
    deadline: {
      type: Date,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
