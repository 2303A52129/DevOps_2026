const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const upload = require("../middleware/multer");

// ✅ CORRECT (NO extra /applications)
router.post(
  "/:jobId",
  upload.single("resume"),
  applicationController.applyJob
);

// ✅ Candidate views own applications
router.get("/my", applicationController.getMyApplications);

// ✅ Recruiter views applicants
router.get("/job/:jobId", applicationController.getJobApplications);

// ✅ Update status
router.post("/:id/status", applicationController.updateStatus);

// ✅ Withdraw application
router.post("/:id/delete", applicationController.withdraw);

module.exports = router;