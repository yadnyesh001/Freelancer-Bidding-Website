import express from 'express';
import {
  createReview,
  getReviewsForUser,
} from '../controllers/review.controller.js';

import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/:jobId", protect, restrictTo("client"), createReview);
router.get("/user/:userId", getReviewsForUser);

export default router;