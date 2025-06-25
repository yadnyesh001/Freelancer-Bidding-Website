import express from "express";
import {
  createProject,
  getAllProjects,
  getMyProjects,
  getMyAwardedProjects,
  getProjectById,
  updateProject,
  deleteProject,
  awardProject,
  unawardProject,
  closeProject,
  markProjectComplete,
  confirmProjectCompletion,
} from "../controllers/project.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, restrictTo("client"), createProject);
router.get("/", protect, getAllProjects);
router.get("/my-projects", protect, restrictTo("client"), getMyProjects);
router.get("/my-awarded", protect, restrictTo("freelancer"), getMyAwardedProjects);
router.get("/:id", protect, getProjectById);
router.patch("/:id", protect, restrictTo("client"), updateProject);
router.delete("/:id", protect, restrictTo("client"), deleteProject);
router.patch("/:id/mark-complete", protect, restrictTo("freelancer"), markProjectComplete);
router.patch("/:id/confirm-completion", protect, restrictTo("client"), confirmProjectCompletion);

export default router;
