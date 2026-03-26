const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated, isCandidate } = require('../middleware/auth');
const upload = require('../middleware/multer');

router.get('/', isAuthenticated, profileController.getProfile);
router.put('/update', isAuthenticated, profileController.updateProfile);
router.post('/resume', isAuthenticated, upload.single('resume'), profileController.uploadResume);
router.delete('/resume', isAuthenticated, profileController.deleteResume);
router.put('/password', isAuthenticated, profileController.changePassword);

module.exports = router;
