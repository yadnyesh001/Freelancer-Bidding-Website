import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { 
  sendMessage, 
  getMessages, 
  getConversations, 
  startConversation 
} from '../controllers/message.controller.js';

const router = express.Router();

// Get all conversations for logged in user
router.get('/conversations', protect, getConversations);

// Start a new conversation
router.post('/conversations/start', protect, startConversation);

// Send a message to a user
router.post('/send/:receiverId', protect, sendMessage);

// Get messages from a conversation
router.get('/conversation/:conversationId', protect, getMessages);

export default router;