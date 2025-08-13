import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Bid from "../models/bid.model.js";
import Transaction from "../models/transaction.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedRoles = ["client", "freelancer"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-freelance", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.log("Error in signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-freelance", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt-freelance");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total projects posted by this client
    const totalProjects = await Project.countDocuments({ clientId: userId });
    
    // Get projects by status
    const openProjects = await Project.countDocuments({ clientId: userId, status: 'open' });
    const inProgressProjects = await Project.countDocuments({ clientId: userId, status: 'in-progress' });
    const completedProjects = await Project.countDocuments({ clientId: userId, status: 'completed' });

    // Get total bids received on all projects
    const clientProjects = await Project.find({ clientId: userId }).select('_id');
    const projectIds = clientProjects.map(project => project._id);
    const totalBidsReceived = await Bid.countDocuments({ projectId: { $in: projectIds } });

    // Get total amount spent (completed transactions)
    const totalSpent = await Transaction.aggregate([
      { $match: { clientId: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalProjects,
      openProjects,
      inProgressProjects,
      completedProjects,
      totalBidsReceived,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0
    };

    res.status(200).json(stats);
  } catch (error) {
    console.log("Error in getClientStats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFreelancerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total bids placed by this freelancer
    const totalBids = await Bid.countDocuments({ freelancerId: userId });
    
    // Get bids by status
    const pendingBids = await Bid.countDocuments({ freelancerId: userId, status: 'pending' });
    const acceptedBids = await Bid.countDocuments({ freelancerId: userId, status: 'accepted' });
    const rejectedBids = await Bid.countDocuments({ freelancerId: userId, status: 'rejected' });

    // Get awarded projects (accepted bids)
    const awardedProjects = await Project.countDocuments({ 
      awardedTo: userId,
      status: { $in: ['in-progress', 'completed'] }
    });

    // Get completed projects
    const completedProjects = await Project.countDocuments({ 
      awardedTo: userId,
      status: 'completed'
    });

    // Get total earnings (completed transactions)
    const totalEarnings = await Transaction.aggregate([
      { $match: { freelancerId: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalBids,
      pendingBids,
      acceptedBids,
      rejectedBids,
      awardedProjects,
      completedProjects,
      totalEarnings: totalEarnings.length > 0 ? totalEarnings[0].total : 0,
      successRate: totalBids > 0 ? ((acceptedBids / totalBids) * 100).toFixed(1) : 0
    };

    res.status(200).json(stats);
  } catch (error) {
    console.log("Error in getFreelancerStats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, bio, skills, hourlyRate, profilePicture } = req.body;

    // Check if email is being changed and if it's already taken
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (hourlyRate) updateData.hourlyRate = hourlyRate;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};