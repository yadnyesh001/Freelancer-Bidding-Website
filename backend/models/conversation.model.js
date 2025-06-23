import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default: []
  }],
}, {
  timestamps: true
});

conversationSchema.index({ project: 1, participants: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;