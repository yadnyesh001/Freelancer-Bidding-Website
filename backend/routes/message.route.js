import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send/:id', protect, sendMessage);
router.get('/get/:id', protect, getMessages);

export default router;