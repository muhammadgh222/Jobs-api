const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  removeJob,
} = require("../controllers/jobController");
const router = express.Router();

router.route("/").post(protect, createJob).get(protect, getAllJobs);
router
  .route("/:id")
  .get(protect, getJob)
  .patch(protect, updateJob)
  .delete(protect, removeJob);

module.exports = router;
