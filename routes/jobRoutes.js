import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/jobController.js";
import { protect, jobSeeker, adminOrEmployee } from "../middlewares/auth.js";
import { uploadCV } from "../middlewares/upload.js";

const router = express.Router();
//public routes...Start..
router.get("/", getJobs);
router.get("/:id", getJobById);

// Employee routes... Protected by authentication and Roles....
router.use(protect);

router.post("/", adminOrEmployee, createJob);
router.put("/:id", adminOrEmployee, updateJob);
router.delete("/:id", adminOrEmployee, deleteJob);
router.get("/:id/applications", adminOrEmployee, getJobApplications);

// Job seeker routes
router.post("/:id/apply", jobSeeker, uploadCV, applyForJob);

// Update application status
router.put("/applications/:id", adminOrEmployee, updateApplicationStatus);

export default router;
