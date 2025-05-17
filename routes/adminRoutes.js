import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllJobs,
  getAllApplications,
} from "../controllers/adminController.js";
import { protect, admin } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
// manage the Job
router.get("/jobs", getAllJobs);
router.get("/applications", getAllApplications);

export default router;
