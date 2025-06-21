import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: function () {
      return this.messageType === "text";
    }
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text"
  },
  fileUrl: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
export default Message;