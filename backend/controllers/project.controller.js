import Project from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async (req, res) => {
  try {
    const { title, description, category, budget, deadline } = req.body;

    if (!title || !description || !category || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate) || deadlineDate < new Date()) {
      return res.status(400).json({ message: 'Deadline must be a future date' });
    }

    const project = new Project({
      title,
      description,
      category,
      budget,
      deadline: deadlineDate,
      postedBy: req.user._id, 
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Error in createProject:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('postedBy', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getAllProjects:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ postedBy: req.user._id }).populate('postedBy', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getMyProjects:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getMyAwardedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ awardedTo: req.user._id }).populate('postedBy', 'name email');
    res.status(200).json(projects);
  } catch (error) {
    console.log("Error in getMyAwardedProjects:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('postedBy', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.log("Error in getProjectById:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const updateProject = async (req, res) => {
  try {
    const { title, description, budget, deadline } = req.body;

    if (!title || !description || !budget || !deadline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, budget, deadline },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.log("Error in updateProject:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.log("Error in deleteProject:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const closeProject = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: 'closed' },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project closed successfully', project });
  } catch (error) {
    console.log("Error in closeProject:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const markProjectComplete = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: 'completed' },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project marked as complete', project });
  } catch (error) {
    console.log("Error in markProjectComplete:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const confirmProjectCompletion = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: 'confirmed' },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project completion confirmed', project });
  } catch (error) {
    console.log("Error in confirmProjectCompletion:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}