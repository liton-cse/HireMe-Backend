// routes/analyticsRoutes.js
import express from "express";
import { protect, adminOrEmployee } from "../middlewares/auth.js";
import { getApplicantsPerJob } from "../controllers/analyticsController.js";

const router = express.Router();
router.use(protect);
router.get("/applicants/per/job", adminOrEmployee, getApplicantsPerJob);

export default router;
