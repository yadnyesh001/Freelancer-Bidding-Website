import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  const { id: projectId } = req.params;
  const { sender, receiver, message } = req.body;

  if (sender === receiver) {
    return res.status(400).json({ error: "Sender and receiver cannot be the same." });
  }

  try {
    const newMessage = await Message.create({
      project: projectId,
      sender,
      receiver,
      message
    });

    let conversation = await Conversation.findOne({
      project: projectId,
      participants: { $all: [sender, receiver], $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        project: projectId,
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      if (!conversation.messages.includes(newMessage._id)) {
        conversation.messages.push(newMessage._id);
        await conversation.save();
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  const { id: projectId } = req.params;

  try {
    const messages = await Message.find({ project: projectId })
      .sort({ createdAt: 1 }) 
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .lean(); 

    res.status(200).json(messages);
  } catch (error) {
    console.error("GetMessages Error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};