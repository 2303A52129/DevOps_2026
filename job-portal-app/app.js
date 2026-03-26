require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const sessionConfig = require('./config/session');

const app = express();
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());
app.use("/uploads", express.static("uploads"));

// Global locals
app.use((req, res, next) => {
  res.locals.currentUser = {
    id:      req.session.userId   || null,
    name:    req.session.userName || null,
    email:   req.session.userEmail || null,
    role:    req.session.userRole  || null,
    company: req.session.userCompany || null,
  };
  next();
});

app.use('/auth',         require('./routes/auth'));
app.use('/dashboard',    require('./routes/dashboard'));
app.use('/jobs',         require('./routes/jobs'));
app.use('/applications', require('./routes/applications'));
app.use('/profile',      require('./routes/profile'));

app.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

app.use((req, res) => res.status(404).render('404', { title: '404 - Not Found' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    req.flash('error', 'File too large. Max size is 5MB.');
    return res.redirect('back');
  }
  if (err.message === 'Only PDF files are allowed for resumes.') {
    req.flash('error', err.message);
    return res.redirect('back');
  }
  res.status(500).render('500', { title: 'Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
module.exports = app;
