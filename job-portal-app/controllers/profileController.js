const User = require('../models/User');
const Application = require('../models/Application');
const fs = require('fs');
const path = require('path');

const RESUME_DIR = path.join(__dirname, '../public/uploads/resumes');

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const totalApps = req.session.userRole === 'candidate'
      ? await Application.countDocuments({ candidate: req.session.userId })
      : null;
    res.render('profile/index', { title: 'My Profile - JobPortal', user, totalApps });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};

// PUT /profile/update
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, skills, experience, education } = req.body;
    const updateData = { name, email };
    if (req.session.userRole === 'candidate') {
      updateData.skills = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      updateData.experience = experience;
      updateData.education = education;
    }
    await User.findByIdAndUpdate(req.session.userId, updateData);
    req.session.userName = name;
    req.session.userEmail = email;
    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update profile.');
    res.redirect('/profile');
  }
};

// POST /profile/resume - upload resume
exports.uploadResume = async (req, res) => {
  try {
    if (req.session.userRole !== 'candidate') {
      req.flash('error', 'Only candidates can upload a resume.');
      return res.redirect('/profile');
    }
    if (!req.file) {
      req.flash('error', 'Please select a PDF file to upload.');
      return res.redirect('/profile');
    }
    // Delete old resume if exists
    const user = await User.findById(req.session.userId);
    if (user.resume && user.resume.filename) {
      const oldPath = path.join(RESUME_DIR, user.resume.filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await User.findByIdAndUpdate(req.session.userId, {
      resume: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        uploadedAt: new Date(),
      },
    });
    req.flash('success', 'Resume uploaded successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error('Resume upload error:', err);
    req.flash('error', 'Failed to upload resume. Please try again.');
    res.redirect('/profile');
  }
};

// DELETE /profile/resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user.resume && user.resume.filename) {
      const filePath = path.join(RESUME_DIR, user.resume.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await User.findByIdAndUpdate(req.session.userId, {
      resume: { filename: null, originalName: null, uploadedAt: null },
    });
    req.flash('success', 'Resume deleted.');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
};

// PUT /profile/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }
    const user = await User.findById(req.session.userId);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }
    user.password = newPassword;
    await user.save();
    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to change password.');
    res.redirect('/profile');
  }
};
