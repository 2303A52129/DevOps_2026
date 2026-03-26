const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const role   = req.session.userRole;

    if (role === 'recruiter') {
      const totalJobs    = await Job.countDocuments({ postedBy: userId });
      const openJobs     = await Job.countDocuments({ postedBy: userId, isOpen: true });
      const totalApps    = await Application.countDocuments({ job: { $in: await Job.find({ postedBy: userId }).distinct('_id') } });
      const pendingApps  = await Application.countDocuments({ status: 'Pending', job: { $in: await Job.find({ postedBy: userId }).distinct('_id') } });
      const recentJobs   = await Job.find({ postedBy: userId }).sort({ createdAt: -1 }).limit(5);
      return res.render('dashboard/recruiter', {
        title: 'Recruiter Dashboard - JobPortal',
        stats: { totalJobs, openJobs, totalApps, pendingApps },
        recentJobs,
      });
    }

    // Candidate dashboard
    const totalApps    = await Application.countDocuments({ candidate: userId });
    const pending      = await Application.countDocuments({ candidate: userId, status: 'Pending' });
    const accepted     = await Application.countDocuments({ candidate: userId, status: 'Accepted' });
    const rejected     = await Application.countDocuments({ candidate: userId, status: 'Rejected' });
    const recentApps   = await Application.find({ candidate: userId })
      .sort({ createdAt: -1 }).limit(5).populate('job', 'title company location');

    res.render('dashboard/candidate', {
      title: 'Candidate Dashboard - JobPortal',
      stats: { totalApps, pending, accepted, rejected },
      recentApps,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { title: 'Error', error: err.message });
  }
};
