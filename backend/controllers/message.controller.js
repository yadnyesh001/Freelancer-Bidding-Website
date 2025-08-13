import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { message, projectId } = req.body;
  const senderId = req.user._id;

  // Validate message content
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: "Message content is required" });
  }

  if (senderId.toString() === receiverId) {
    return res.status(400).json({ error: "You cannot send a message to yourself" });
  }

  try {
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    // Create the message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      project: projectId || null
    });

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
        lastMessage: newMessage._id,
        lastMessageTime: new Date()
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.lastMessage = newMessage._id;
      conversation.lastMessageTime = new Date();
      await conversation.save();
    }

    // Populate the message before sending response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  try {
    // Find conversation and verify user is participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "You are not authorized to view this conversation" });
    }

    const messages = await Message.find({ 
      _id: { $in: conversation.messages } 
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email profilePicture')
      .populate('receiver', 'name email profilePicture')
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    console.error("GetMessages Error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name email profilePicture role')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 })
      .lean();

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== userId.toString());
      return {
        id: conv._id,
        participant: {
          id: otherParticipant._id,
          name: otherParticipant.name,
          email: otherParticipant.email,
          avatar: otherParticipant.profilePicture,
          role: otherParticipant.role,
          status: "offline" // You can implement real-time status later
        },
        lastMessage: conv.lastMessage?.message || '',
        lastMessageTime: conv.lastMessageTime,
        unreadCount: 0, // You can implement unread message count later
        project: conv.project?.title || null
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error("GetConversations Error:", error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
};

export const startConversation = async (req, res) => {
  try {
    const { receiverId, projectId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ error: "You cannot start a conversation with yourself" });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (conversation) {
      return res.status(200).json({ 
        message: "Conversation already exists", 
        conversationId: conversation._id 
      });
    }

    // Create new conversation
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
      messages: [],
      project: projectId || null,
      lastMessageTime: new Date()
    });

    res.status(201).json({ 
      message: "Conversation created successfully", 
      conversationId: conversation._id 
    });
  } catch (error) {
    console.error("StartConversation Error:", error);
    res.status(500).json({ error: "Failed to start conversation" });
  }
};