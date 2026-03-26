const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please login to continue.');
  res.redirect('/auth/login');
};

const isCandidate = (req, res, next) => {
  if (req.session && req.session.userRole === 'candidate') return next();
  req.flash('error', 'Only candidates can access this.');
  res.redirect('/dashboard');
};

const isRecruiter = (req, res, next) => {
  if (req.session && req.session.userRole === 'recruiter') return next();
  req.flash('error', 'Only recruiters can access this.');
  res.redirect('/dashboard');
};

const isGuest = (req, res, next) => {
  if (!req.session || !req.session.userId) return next();
  res.redirect('/dashboard');
};

module.exports = { isAuthenticated, isCandidate, isRecruiter, isGuest };
