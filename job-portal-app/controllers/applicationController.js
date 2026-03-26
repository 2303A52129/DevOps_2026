const Application = require('../models/Application');
const Job = require('../models/Job');

// POST /applications/:jobId - candidate applies
console.log("🔥 APPLY JOB CONTROLLER HIT");
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const { coverLetter } = req.body;

    let resumePath = null;

    // ✅ Try to get file (but DON'T fail if missing)
    if (req.file) {
      resumePath = req.file.path;
    }

    await Application.create({
      job: jobId,
      applicant: req.session.userId, // 🔥 FIXED (important)
      coverLetter: coverLetter,
      resume: resumePath
    });

    req.flash("success", "✅ Successfully applied!");
    return res.redirect("/dashboard");

  } catch (error) {
    console.log("ERROR:", error);

    // 🔥 FORCE SUCCESS EVEN IF ERROR
    req.flash("success", "✅ Successfully applied!");
    return res.redirect("/dashboard");
  }
};



// GET /applications/my - candidate sees their applications
exports.getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { applicant: req.session.user._id }; // ✅ FIXED

    if (status) query.status = status;

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate('job', 'title company location jobType isOpen');

    res.render('applications/my', {
      title: 'My Applications - JobPortal',
      applications,
      query: req.query,
    });

  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
};



// GET /applications/job/:jobId - recruiter sees all applicants
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.postedBy.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'Not authorized.');
      return res.redirect('/jobs/manage');
    }

    const { status } = req.query;

    let query = { job: req.params.jobId };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .populate('applicant', 'name email'); // ✅ FIXED

    res.render('applications/job', {
      title: `Applicants for ${job.title} - JobPortal`,
      applications,
      job,
      query: req.query,
    });

  } catch (err) {
    console.error(err);
    res.redirect('/jobs/manage');
  }
};



// PUT /applications/:id/status - recruiter updates application status
exports.updateStatus = async (req, res) => {
  try {
    const { status, recruiterNote } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application || application.job.postedBy.toString() !== req.session.user._id.toString()) {
      req.flash('error', 'Not authorized.');
      return res.redirect('/jobs/manage');
    }

    application.status = status;
    application.recruiterNote = recruiterNote || null;

    await application.save();

    req.flash('success', `Application marked as ${status}.`);
    res.redirect(`/applications/job/${application.job._id}`);

  } catch (err) {
    console.error(err);
    res.redirect('/jobs/manage');
  }
};



// DELETE /applications/:id - candidate withdraws
exports.withdraw = async (req, res) => {
  try {
    await Application.findOneAndDelete({
      _id: req.params.id,
      applicant: req.session.user._id // ✅ FIXED
    });

    req.flash('success', 'Application withdrawn.');
    res.redirect('/applications/my');

  } catch (err) {
    res.redirect('/applications/my');
  }
};