import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Mobile App Development',
        'UI/UX Design',
        'Digital Marketing',
        'Game Development',
        'Data Entry',
        'Business Consulting',
        'Data Science',
        'Cybersecurity',
        'Video Editing',
        'AI & Machine Learning',
      ],
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
      },
    ],
    awardedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in-progress', 'pending-review', 'completed', 'cancelled'],
      default: 'open',
    },
    deliverable: {
      description: {
        type: String,
        default: null,
      },
      files: [{
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }],
      submittedAt: {
        type: Date,
        default: null,
      },
      notes: {
        type: String,
        default: null,
      }
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;