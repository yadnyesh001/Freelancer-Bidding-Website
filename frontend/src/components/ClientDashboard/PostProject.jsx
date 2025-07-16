import React, { useState } from "react";
import axios from "axios";

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
];

const PostProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, budget, deadline } = formData;

    if (!title || !description || !category || !budget || !deadline) {
      alert("All fields are required.");
      return;
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    if (isNaN(deadlineDate) || deadlineDate <= now) {
      alert("Deadline must be a future date.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/v1/project", {
        title,
        description,
        category,
        budget: Number(budget),
        deadline,
      });
      alert("Project posted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
      });
    } catch (error) {
      console.error("Error posting project:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date in yyyy-mm-dd format for deadline min
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Post a New Project</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Project Title"
        className="w-full p-2 border rounded"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Project Description"
        className="w-full p-2 border rounded h-32"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="">Select a Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        name="budget"
        type="number"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Budget (in ₹)"
        min={0}
        className="w-full p-2 border rounded"
      />

      <input
        name="deadline"
        type="date"
        value={formData.deadline}
        onChange={handleChange}
        min={getTomorrowDate()}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Posting..." : "Post Project"}
      </button>
    </form>
  );
};

export default PostProject;
