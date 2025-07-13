import express from 'express';
import {
  getClients,
  getFreelancers,
  getProjects,
  deleteUser, 
  deleteProject,
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/clients', protect, restrictTo("admin"), getClients);
router.get('/freelancers', protect, restrictTo("admin"), getFreelancers);
router.get('/projects', protect, restrictTo("admin"), getProjects);
router.delete('/users/:id', protect, restrictTo("admin"), deleteUser);
router.delete('/projects/:id', protect, restrictTo("admin"), deleteProject);

export default router;