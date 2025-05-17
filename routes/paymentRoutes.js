import express from "express";
import {
  processApplicationPayment,
  getInvoice,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/process", protect, processApplicationPayment);
router.get("/invoice/:id", protect, getInvoice);

export default router;
