import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  AlertCircle,
  PlayCircle,
  PauseCircle,
  MessageCircle,
  FileText,
  Upload,
  ExternalLink
} from 'lucide-react';

const AwardedProjects = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [deliverableInputs, setDeliverableInputs] = useState({});
  const [showDeliveryForm, setShowDeliveryForm] = useState({});

  const queryClient = useQueryClient();

  const statusOptions = ['All', 'Active', 'Completed', 'On Hold'];

  // Fetch awarded projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['awarded-projects'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/project/my-awarded');
      return data;
    }
  });

  // Submit deliverable mutation
  const submitDeliverableMutation = useMutation({
    mutationFn: async ({ projectId, deliverableData }) => {
      const { data } = await axiosInstance.post(`/project/${projectId}/deliverable`, deliverableData);
      return data;
    },
    onSuccess: () => {
      toast.success('Deliverable submitted successfully!');
      queryClient.invalidateQueries(['awarded-projects']);
      setShowDeliveryForm({});
      setDeliverableInputs({});
    },
    onError: () => {
      toast.error('Failed to submit deliverable. Please try again.');
    }
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'active':
      case 'in progress':
        return <PlayCircle className="text-blue-500" size={20} />;
      case 'on hold':
        return <PauseCircle className="text-yellow-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const handleDeliverableInputChange = (projectId, field, value) => {
    setDeliverableInputs(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

  const handleSubmitDeliverable = (projectId) => {
    const deliverable = deliverableInputs[projectId];
    if (!deliverable?.description || !deliverable?.files) {
      toast.error('Please provide description and files');
      return;
    }

    submitDeliverableMutation.mutate({
      projectId,
      deliverableData: deliverable
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    return matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Error loading awarded projects. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage your awarded projects and deliverables</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-600">{filteredProjects.length} projects</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'Active').length}
              </p>
            </div>
            <PlayCircle className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'Completed').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">
                ${projects.reduce((sum, p) => sum + (p.awardedBid?.amount || 0), 0)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No awarded projects found.</p>
          <p className="text-gray-400 mt-2">Keep bidding on projects to see them here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow-md">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(project.status)}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span className="font-medium">Budget: ${project.awardedBid?.amount || project.budget}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2" />
                  <span>Started: {new Date(project.awardedAt || project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2" />
                  <span>Client: {project.client?.name || 'Anonymous'}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Project Progress</span>
                  <span className="text-gray-800 font-medium">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Skills */}
              {project.skills && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <MessageCircle size={16} className="mr-1" />
                    Message Client
                  </button>
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <ExternalLink size={16} className="mr-1" />
                    View Details
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {project.status !== 'Completed' && (
                    <button
                      onClick={() => setShowDeliveryForm(prev => ({
                        ...prev,
                        [project._id]: !prev[project._id]
                      }))}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Upload size={16} className="mr-2" />
                      Submit Deliverable
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Form */}
              {showDeliveryForm[project._id] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Submit Project Deliverable</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={deliverableInputs[project._id]?.description || ''}
                        onChange={(e) => handleDeliverableInputChange(project._id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe what you're delivering..."
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Files/Links
                      </label>
                      <input
                        type="text"
                        value={deliverableInputs[project._id]?.files || ''}
                        onChange={(e) => handleDeliverableInputChange(project._id, 'files', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add file links or descriptions..."
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeliveryForm(prev => ({
                          ...prev,
                          [project._id]: false
                        }))}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmitDeliverable(project._id)}
                        disabled={submitDeliverableMutation.isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                      >
                        {submitDeliverableMutation.isLoading ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Deliverables */}
              {project.deliverables && project.deliverables.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Recent Deliverables</h4>
                  {project.deliverables.slice(-2).map((deliverable, index) => (
                    <div key={index} className="text-sm text-green-700 mb-1">
                      • {deliverable.description} - {new Date(deliverable.submittedAt).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AwardedProjects;
