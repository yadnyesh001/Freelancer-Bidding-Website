import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  timeline: String,
  description: String,
  awarded: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  attachments: [String]
}, {
  timestamps: true
});

const Bid = mongoose.model("Bid", bidSchema);
export default Bid;