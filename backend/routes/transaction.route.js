import express from "express";
import {
  addFunds,
  payFreelancer,
} from "../controllers/transaction.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-funds", protect, addFunds);
router.post("/payment", protect, payFreelancer);

export default router;