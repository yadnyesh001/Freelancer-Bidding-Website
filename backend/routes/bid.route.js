import express from 'express';
import {
  placeBid,
  getBidsByProjectId,
  getMyBids,
  updateBid,
  deleteBid,
  awardBid
} from '../controllers/bid.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/my", protect, restrictTo("freelancer"), getMyBids);
router.get("/project/:projectId", protect, restrictTo("client"), getBidsByProjectId);
router.post("/award/:bidId", protect, restrictTo("client"), awardBid);
router.post("/:projectId", protect, restrictTo("freelancer"), placeBid);
router.patch("/:bidId", protect, restrictTo("freelancer"), updateBid);
router.delete("/:bidId", protect, restrictTo("freelancer"), deleteBid);

export default router;