import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', 'admin'],
    default: 'freelancer'
  },
  profilePicture: {
    type: String,
    default: ""
  },
  wallet: {
    type: Number,
    default: 0
  },
  ratings: [{
    type: Number,
    default: 0,
    min: 1,
    max: 5
  }],
  skills: {
    type: [String], 
    default: [], 
  },
  bio: {
    type: String,
    default: '', 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🧮 Virtual field for average rating
userSchema.virtual('averageRating').get(function () {
  if (!this.ratings.length) return 0;
  const sum = this.ratings.reduce((a, b) => a + b, 0);
  return (sum / this.ratings.length).toFixed(2);
});

const User = mongoose.model("User", userSchema);

export default User;
