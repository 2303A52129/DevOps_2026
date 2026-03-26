const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login - JobPortal' });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/auth/login');
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }
    user.lastLogin = new Date();
    await user.save();
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.userCompany = user.company;
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/auth/login');
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register - JobPortal' });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, company, companyWebsite } = req.body;
    if (!name || !email || !password || !role) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/auth/register');
    }
    if (!['candidate', 'recruiter'].includes(role)) {
      req.flash('error', 'Please select a valid role.');
      return res.redirect('/auth/register');
    }
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }
    if (role === 'recruiter' && !company) {
      req.flash('error', 'Company name is required for recruiters.');
      return res.redirect('/auth/register');
    }
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/auth/register');
    }
    const userData = { name, email, password, role };
    if (role === 'recruiter') { userData.company = company; userData.companyWebsite = companyWebsite; }
    const user = await User.create(userData);
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.userCompany = user.company || null;
    req.flash('success', `Welcome, ${user.name}! You're registered as a ${role}.`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
};
