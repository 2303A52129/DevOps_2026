const Job = require('../models/Job');
const Application = require('../models/Application');

// GET /jobs - public listing for candidates to browse
exports.getJobs = async (req, res) => {
  try {
    const { search, category, jobType, sort } = req.query;
    let query = { isOpen: true };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (jobType)  query.jobType  = jobType;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const jobs = await Job.find(query).sort(sortOption).populate('postedBy', 'name company');
    res.render('jobs/index', { title: 'Browse Jobs - JobPortal', jobs, query: req.query });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Error', error: err.message });
  }
};

// GET /jobs/:id - view single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company companyWebsite');
    if (!job) { req.flash('error', 'Job not found.'); return res.redirect('/jobs'); }

    let alreadyApplied = false;
    if (req.session.userId && req.session.userRole === 'candidate') {
      alreadyApplied = !!(await Application.findOne({ job: job._id, candidate: req.session.userId }));
    }
    res.render('jobs/show', { title: `${job.title} - JobPortal`, job, alreadyApplied });
  } catch (err) {
    console.error(err);
    res.redirect('/jobs');
  }
};

// --- RECRUITER ONLY ---

// GET /jobs/manage - recruiter's own jobs
exports.getManageJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.session.userId }).sort({ createdAt: -1 });
    res.render('jobs/manage', { title: 'My Job Postings - JobPortal', jobs });
  } catch (err) {
    res.redirect('/dashboard');
  }
};

// GET /jobs/new
exports.getNewJob = (req, res) => {
  res.render('jobs/create', { title: 'Post a Job - JobPortal' });
};

// POST /jobs
exports.createJob = async (req, res) => {
  try {
    const { title, location, jobType, category, description, requirements, salary, skills, deadline } = req.body;
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const recruiter = await require('../models/User').findById(req.session.userId);
    await Job.create({
      title, company: recruiter.company || req.session.userName,
      location, jobType, category, description, requirements,
      salary, skills: skillsArray,
      deadline: deadline || null,
      postedBy: req.session.userId,
    });
    req.flash('success', 'Job posted successfully!');
    res.redirect('/jobs/manage');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to post job.');
    res.redirect('/jobs/new');
  }
};

// GET /jobs/:id/edit
exports.getEditJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || job.postedBy.toString() !== req.session.userId) {
      req.flash('error', 'Not authorized.'); return res.redirect('/jobs/manage');
    }
    res.render('jobs/edit', { title: 'Edit Job - JobPortal', job });
  } catch (err) { res.redirect('/jobs/manage'); }
};

// PUT /jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const { title, location, jobType, category, description, requirements, salary, skills, deadline, isOpen } = req.body;
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    await Job.findByIdAndUpdate(req.params.id, {
      title, location, jobType, category, description, requirements,
      salary, skills: skillsArray, deadline: deadline || null,
      isOpen: isOpen === 'on',
    });
    req.flash('success', 'Job updated successfully!');
    res.redirect('/jobs/manage');
  } catch (err) {
    req.flash('error', 'Failed to update job.');
    res.redirect(`/jobs/${req.params.id}/edit`);
  }
};

// DELETE /jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id });
    req.flash('success', 'Job deleted.');
    res.redirect('/jobs/manage');
  } catch (err) { res.redirect('/jobs/manage'); }
};
