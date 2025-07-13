import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => axiosInstance.get("/admin/clients").then(res => res.data),
  });

  // Fetch freelancers
  const { data: freelancers, isLoading: loadingFreelancers } = useQuery({
    queryKey: ["freelancers"],
    queryFn: () => axiosInstance.get("/admin/freelancers").then(res => res.data),
  });

  // Fetch projects
  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => axiosInstance.get("/admin/projects").then(res => res.data),
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries(["clients"]);
      queryClient.invalidateQueries(["freelancers"]);
    },
    onError: () => toast.error("Error deleting user"),
  });

  // Delete project
  const deleteProjectMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/projects/${id}`),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries(["projects"]);
    },
    onError: () => toast.error("Error deleting project"),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Clients */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Clients</h2>
        {loadingClients ? (
          <p>Loading clients...</p>
        ) : (
          <ul className="space-y-2">
            {clients?.map((client) => (
              <li key={client._id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>{client.name} ({client.email})</span>
                <button
                  onClick={() => deleteUserMutation.mutate(client._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Freelancers */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Freelancers</h2>
        {loadingFreelancers ? (
          <p>Loading freelancers...</p>
        ) : (
          <ul className="space-y-2">
            {freelancers?.map((freelancer) => (
              <li key={freelancer._id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>{freelancer.name} ({freelancer.email})</span>
                <button
                  onClick={() => deleteUserMutation.mutate(freelancer._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        {loadingProjects ? (
          <p>Loading projects...</p>
        ) : (
          <ul className="space-y-2">
            {projects?.map((project) => (
              <li key={project._id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                <span>{project.title} (by {project.client?.name || "Unknown"})</span>
                <button
                  onClick={() => deleteProjectMutation.mutate(project._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
