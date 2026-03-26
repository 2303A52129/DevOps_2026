const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { isAuthenticated, isRecruiter } = require('../middleware/auth');

router.get('/', isAuthenticated, jobController.getJobs);
router.get('/manage', isAuthenticated, isRecruiter, jobController.getManageJobs);
router.get('/new', isAuthenticated, isRecruiter, jobController.getNewJob);
router.post('/', isAuthenticated, isRecruiter, jobController.createJob);
router.get('/:id', isAuthenticated, jobController.getJob);
router.get('/:id/edit', isAuthenticated, isRecruiter, jobController.getEditJob);
router.put('/:id', isAuthenticated, isRecruiter, jobController.updateJob);
router.delete('/:id', isAuthenticated, isRecruiter, jobController.deleteJob);

module.exports = router;
