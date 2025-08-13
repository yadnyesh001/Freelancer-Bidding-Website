import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Calendar,
  Briefcase,
  Heart,
  ExternalLink,
  ChevronDown,
  User
} from 'lucide-react';

const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [bidInputs, setBidInputs] = useState({});

  const queryClient = useQueryClient();

  const categories = [
    'All', 'Web Development', 'Mobile Development', 'UI/UX Design', 
    'Graphic Design', 'Content Writing', 'Digital Marketing', 'Data Science'
  ];

  const priceRanges = [
    'All', '$0 - $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500+'
  ];

  // Fetch projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/project');
      return data;
    }
  });

  // Bid mutation
  const bidMutation = useMutation({
    mutationFn: async ({ projectId, bidData }) => {
      const { data } = await axiosInstance.post(`/bid/${projectId}`, {
        ...bidData
      });
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success('Bid submitted successfully!');
      setBidInputs(prev => ({
        ...prev,
        [variables.projectId]: { amount: '', description: '' }
      }));
      queryClient.invalidateQueries(['projects']);
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        toast.error('You have already bid on this project');
      } else {
        toast.error('Failed to submit bid. Please try again.');
      }
    }
  });

  const handleInputChange = (projectId, field, value) => {
    setBidInputs(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value
      }
    }));
  };

  const handlePlaceBid = (projectId) => {
    const bid = bidInputs[projectId];
    if (!bid?.amount || !bid?.description) {
      toast.error('Please fill in all fields');
      return;
    }

    bidMutation.mutate({
      projectId,
      bidData: {
        amount: parseFloat(bid.amount),
        description: bid.description
      }
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'budget-high':
        return (b.budget || 0) - (a.budget || 0);
      case 'budget-low':
        return (a.budget || 0) - (b.budget || 0);
      default:
        return 0;
    }
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
        Error loading projects. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Browse Projects</h1>
          <p className="text-gray-600 mt-1">Find projects that match your skills and interests</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-600">{sortedProjects.length} projects found</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Filter size={20} className="mr-2" />
            Filters
            <ChevronDown className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Length</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Durations</option>
                  <option>Less than 1 month</option>
                  <option>1-3 months</option>
                  <option>3-6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client History</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Clients</option>
                  <option>New Clients</option>
                  <option>Returning Clients</option>
                  <option>Top Rated Clients</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects List */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedProjects.map(project => (
            <div key={project._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                      {project.title}
                    </h2>
                    {project.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {project.isUrgent && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">{project.description}</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                  <Heart size={20} />
                </button>
              </div>

              {/* Project Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>by <span className="font-medium">{project.postedBy?.name || 'Anonymous Client'}</span></span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  <span className="font-medium">${project.budget}</span>
                  <span className="ml-1">({project.budgetType || 'Fixed'})</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  <span>{project.bids?.length || 0} proposals</span>
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

              {/* Client Info */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {project.client?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">{project.client?.name || 'Anonymous Client'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Client</span>
                  </div>
                </div>
              </div>

              {/* Bid Form */}
              <div className="border-t pt-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount ($)
                    </label>
                    <input
                      type="number"
                      value={bidInputs[project._id]?.amount || ''}
                      onChange={(e) => handleInputChange(project._id, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your bid amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposal Description
                    </label>
                    <textarea
                      value={bidInputs[project._id]?.description || ''}
                      onChange={(e) => handleInputChange(project._id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your approach..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <ExternalLink size={16} className="mr-1" />
                    View Details
                  </button>
                  <button
                    onClick={() => handlePlaceBid(project._id)}
                    disabled={bidMutation.isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {bidMutation.isLoading ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {sortedProjects.length > 0 && (
        <div className="text-center">
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
            Load More Projects
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseProjects;
