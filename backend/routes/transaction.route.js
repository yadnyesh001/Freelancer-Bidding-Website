import express from "express";
import {
  addFunds,
  payFreelancer,
  getMyTransactions,
} from "../controllers/transaction.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/my", protect, getMyTransactions);
router.post("/add-funds", protect, addFunds);
router.post("/payment", protect, restrictTo("client"), payFreelancer);

export default router;