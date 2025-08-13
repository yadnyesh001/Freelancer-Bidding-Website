import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  FileText, 
  Tag,
  Send,
  AlertCircle
} from "lucide-react";

const categories = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "Game Development",
  "Data Entry",
  "Business Consulting",
  "Data Science",
  "Cybersecurity",
  "Video Editing",
  "AI & Machine Learning",
  "Content Writing",
  "Graphic Design",
  "Photography",
  "Translation",
  "Virtual Assistant",
  "E-commerce",
  "SEO",
  "Social Media Management",
  "WordPress Development"
];

const PostProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    skills: "",
  });

  const queryClient = useQueryClient();

  const postProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await axiosInstance.post("/project", projectData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Project posted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        skills: "",
      });
      // Invalidate and refetch projects
      queryClient.invalidateQueries(['projects']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to post project";
      toast.error(errorMessage);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, budget, deadline } = formData;

    // Validation
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Project description is required");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!budget || budget <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }
    if (!deadline) {
      toast.error("Please select a deadline");
      return;
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    if (deadlineDate <= now) {
      toast.error("Deadline must be a future date");
      return;
    }

    // Prepare project data
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      category,
      budget: Number(budget),
      deadline,
      skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
    };

    postProjectMutation.mutate(projectData);
  };

  // Get tomorrow's date in yyyy-mm-dd format for deadline min
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <Briefcase className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Post a New Project</h1>
            <p className="text-gray-600">Describe your project and get bids from talented freelancers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline mr-2" size={16} />
              Project Title *
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Build a responsive e-commerce website"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              maxLength={100}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.title.length}/100 characters</p>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline mr-2" size={16} />
              Project Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of your project including requirements, deliverables, and any specific instructions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32 resize-vertical"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
          </div>

          {/* Category and Skills Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline mr-2" size={16} />
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required (Optional)
              </label>
              <input
                name="skills"
                type="text"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>
          </div>

          {/* Budget and Deadline Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-2" size={16} />
                Budget ($) *
              </label>
              <input
                name="budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Enter your budget"
                min="1"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">Set a realistic budget for your project</p>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Deadline *
              </label>
              <input
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                min={getTomorrowDate()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-sm text-gray-500 mt-1">When do you need this project completed?</p>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="text-blue-600 mr-3 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a successful project post:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Be specific about your requirements and deliverables</li>
                  <li>• Set a realistic budget and timeline</li>
                  <li>• Include relevant skills to attract the right freelancers</li>
                  <li>• Provide examples or references if available</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={postProjectMutation.isPending}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {postProjectMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2" size={16} />
                  Post Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
