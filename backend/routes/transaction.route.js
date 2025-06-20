import express from "express";
import {
  addFunds,
  payFreelancer,
} from "../controllers/transaction.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add-funds", protect, addFunds);
router.post("/payment", protect, restrictTo("client"), payFreelancer);

export default router;