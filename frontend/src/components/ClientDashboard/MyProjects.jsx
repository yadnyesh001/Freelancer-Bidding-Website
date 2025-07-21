import React, { useEffect, useState } from "react";
import axios from "axios";
import BidsOnMyProjects from "./BidsOnMyProjects"; // 🔁 Import the component

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null); // 👈 Track which project's bids are visible

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/v1/project/my-projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-gray-500">Loading your projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Projects</h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">You haven't posted any projects yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="border p-4 rounded shadow hover:shadow-md transition duration-200"
            >
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                <div><strong>Category:</strong> {p.category}</div>
                <div><strong>Budget:</strong> ₹{p.budget}</div>
                <div>
                  <strong>Status:</strong>
                  <span className={`ml-1 px-2 py-0.5 rounded text-white text-xs ${
                    p.status === "open"
                      ? "bg-green-500"
                      : p.status === "in-progress"
                      ? "bg-blue-500"
                      : p.status === "completed"
                      ? "bg-gray-500"
                      : p.status === "pending-review"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div><strong>Deadline:</strong> {new Date(p.deadline).toLocaleDateString()}</div>
                <div><strong>Posted:</strong> {new Date(p.createdAt).toLocaleString()}</div>
              </div>

              {/* 🔽 View Bids Toggle Button */}
              <div className="mt-4">
                <button
                  className="px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={() =>
                    setSelectedProjectId(selectedProjectId === p._id ? null : p._id)
                  }
                >
                  {selectedProjectId === p._id ? "Hide Bids" : "View Bids"}
                </button>
              </div>

              {/* 🔽 Bids Component (Only for selected project) */}
              {selectedProjectId === p._id && (
                <div className="mt-4">
                  <BidsOnMyProjects projectId={p._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
