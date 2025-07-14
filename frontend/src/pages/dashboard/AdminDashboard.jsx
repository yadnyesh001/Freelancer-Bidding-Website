import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { 
  Menu, 
  X, 
  Users, 
  UserCheck, 
  Briefcase, 
  Mail, 
  Trash2, 
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("clients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Queries
  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => axiosInstance.get("/admin/clients").then((res) => res.data),
  });

  const { data: freelancers, isLoading: loadingFreelancers } = useQuery({
    queryKey: ["freelancers"],
    queryFn: () => axiosInstance.get("/admin/freelancers").then((res) => res.data),
  });

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: () => axiosInstance.get("/admin/projects").then((res) => res.data),
  });

  // Mutations
  const deleteUserMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["clients"]);
      queryClient.invalidateQueries(["freelancers"]);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Error deleting user"),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/projects/${id}`),
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => toast.error(error.response?.data?.message || "Error deleting project"),
  });

  // Filter and search logic
  const filterData = (data, type) => {
    if (!data) return [];
    
    let filtered = data;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => {
        const searchFields = type === "projects" 
          ? [item.title, item.client?.name]
          : [item.name, item.email];
        
        return searchFields.some(field => 
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    return filtered;
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case "clients": return <Users className="w-5 h-5" />;
      case "freelancers": return <UserCheck className="w-5 h-5" />;
      case "projects": return <Briefcase className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.inactive}`}>
        {status || "Active"}
      </span>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const EmptyState = ({ type }) => (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
        {getTabIcon(type)}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {type} found</h3>
      <p className="text-gray-500">Get started by adding your first {type.slice(0, -1)}.</p>
    </div>
  );

  const renderClientCard = (client) => (
    <div key={client._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="w-4 h-4 mr-1" />
              {client.email}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
          {getStatusBadge(client.status)}
          <button
            onClick={() => deleteUserMutation.mutate(client._id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 ml-2 sm:ml-0"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Joined {new Date(client.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            {client.projectCount || 0} projects
          </div>
        </div>
      </div>
    </div>
  );

  const renderFreelancerCard = (freelancer) => (
    <div key={freelancer._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="w-4 h-4 mr-1" />
              {freelancer.email}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
          {getStatusBadge(freelancer.status)}
          <button
            onClick={() => deleteUserMutation.mutate(freelancer._id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 ml-2 sm:ml-0"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Joined {new Date(freelancer.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            ${freelancer.hourlyRate || 0}/hr
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectCard = (project) => (
    <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              Client: {project.client?.name || "Unknown"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
          {getStatusBadge(project.status)}
          <button
            onClick={() => deleteProjectMutation.mutate(project._id)}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 ml-2 sm:ml-0"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500 space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Created {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            ${project.budget || 0}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (selectedTab === "clients") {
      if (loadingClients) return <LoadingSpinner />;
      const filteredClients = filterData(clients, "clients");
      if (filteredClients.length === 0) return <EmptyState type="clients" />;
      return (
        <div className="space-y-4">
          {filteredClients.map(renderClientCard)}
        </div>
      );
    }

    if (selectedTab === "freelancers") {
      if (loadingFreelancers) return <LoadingSpinner />;
      const filteredFreelancers = filterData(freelancers, "freelancers");
      if (filteredFreelancers.length === 0) return <EmptyState type="freelancers" />;
      return (
        <div className="space-y-4">
          {filteredFreelancers.map(renderFreelancerCard)}
        </div>
      );
    }

    if (selectedTab === "projects") {
      if (loadingProjects) return <LoadingSpinner />;
      const filteredProjects = filterData(projects, "projects");
      if (filteredProjects.length === 0) return <EmptyState type="projects" />;
      return (
        <div className="space-y-4">
          {filteredProjects.map(renderProjectCard)}
        </div>
      );
    }
  };

  const getTabCount = () => {
    switch (selectedTab) {
      case "clients": return clients?.length || 0;
      case "freelancers": return freelancers?.length || 0;
      case "projects": return projects?.length || 0;
      default: return 0;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Now truly sticky */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-2">
              {[
                { key: "clients", label: "Clients", icon: Users },
                { key: "freelancers", label: "Freelancers", icon: UserCheck },
                { key: "projects", label: "Projects", icon: Briefcase }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTab(key);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    selectedTab === key
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 flex flex-col h-full">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize flex items-center">
                {getTabIcon(selectedTab)}
                <span className="ml-3">{selectedTab}</span>
                <span className="ml-2 text-sm sm:text-base font-normal text-gray-500">
                  ({getTabCount()})
                </span>
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Manage your {selectedTab} and their activities
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${selectedTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;