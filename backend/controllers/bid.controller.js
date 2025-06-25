import Bid from "../models/bid.model.js";
import Project from "../models/project.model.js";

export const placeBid = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount, description } = req.body;

    if (!amount || !description) {
      return res
        .status(400)
        .json({ message: "Amount and description are required" });
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Bid amount must be greater than zero" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const existingBid = await Bid.findOne({
      project: projectId,
      freelancer: req.user._id,
    });

    if (existingBid) {
      return res
        .status(400)
        .json({ message: "You have already placed a bid on this project" });
    }

    const bid = await Bid.create({
      project: projectId,
      freelancer: req.user._id,
      amount,
      description,
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    console.error("Error in placeBid:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBidsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to view bids for this project",
        });
    }

    // 🔽 Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalBids = await Bid.countDocuments({ project: projectId });

    const bids = await Bid.find({ project: projectId })
      .populate("freelancer", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Bids retrieved successfully",
      totalBids,
      currentPage: page,
      totalPages: Math.ceil(totalBids / limit),
      bids,
    });
  } catch (error) {
    console.error("Error in getBidsByProject:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBids = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bids = await Bid.find({ freelancer: req.user._id })
      .populate("project", "title budget deadline status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Bids retrieved successfully",
      currentPage: page,
      bids,
    });
  } catch (error) {
    console.error("Error in getMyBids:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { amount, description, timeline, attachments } = req.body;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this bid" });
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return res
          .status(400)
          .json({ message: "Bid amount must be greater than zero" });
      }
      bid.amount = amount;
    }

    if (description !== undefined) bid.description = description;
    if (timeline !== undefined) bid.timeline = timeline;
    if (attachments !== undefined) bid.attachments = attachments;

    await bid.save();

    res.status(200).json({
      message: "Bid updated successfully",
      bid,
    });
  } catch (error) {
    console.error("Error in updateBid:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.freelancer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this bid" });
    }

    if (bid.awarded || bid.status === "accepted") {
      return res
        .status(400)
        .json({ message: "You cannot delete an awarded or accepted bid" });
    }

    await bid.deleteOne();
    res.status(200).json({
      message: "Bid deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBid:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const awardBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    const project = await Project.findById(bid.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to award this bid" });
    }

    if (bid.awarded) {
      return res.status(400).json({ message: "This bid is already awarded" });
    }

    bid.awarded = true;
    bid.status = "accepted";
    await bid.save();

    project.awardedTo = bid.freelancer;
    project.status = "in-progress";
    await project.save();

    await Bid.updateMany(
      {
        project: bid.project,
        _id: { $ne: bidId },
      },
      { $set: { status: "rejected", awarded: false } }
    );

    res.status(200).json({
      message: "Bid awarded successfully",
      bid,
      project,
    });
  } catch (error) {
    console.error("Error in awardBid:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};