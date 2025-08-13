import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../AuthContext';
import { axiosInstance } from '../../lib/axios';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Star,
  TrendingUp,
  Calendar,
  AlertCircle,
  Award,
  Target,
  Search
} from 'lucide-react';

const FreelancerHome = ({ onTabChange }) => {
  const { user } = useAuth();
  const [activeAction, setActiveAction] = useState(null);

  // Fetch freelancer stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['freelancer-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/freelancer/stats');
      return data;
    }
  });

  // Fetch recent awarded projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['awarded-projects-preview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/project/my-awarded');
      return data.slice(0, 3); // Get only first 3 for preview
    }
  });

  // Fetch available projects for browsing
  const { data: availableProjects = [], isLoading: availableLoading } = useQuery({
    queryKey: ['available-projects-preview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/project');
      return data.slice(0, 3); // Get only first 3 for preview
    }
  });

  const stats = statsData ? [
    {
      label: 'Active Bids',
      value: statsData.pendingBids?.toString() || '0',
      icon: Users,
      color: 'bg-blue-500',
      change: `${statsData.totalBids || 0} total bids`
    },
    {
      label: 'Projects Won',
      value: statsData.acceptedBids?.toString() || '0',
      icon: Award,
      color: 'bg-green-500',
      change: `${statsData.completedProjects || 0} completed`
    },
    {
      label: 'Total Earnings',
      value: `$${statsData.totalEarnings || 0}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: `${statsData.awardedProjects || 0} awarded projects`
    },
    {
      label: 'Success Rate',
      value: `${statsData.successRate || 0}%`,
      icon: Target,
      color: 'bg-orange-500',
      change: `${statsData.rejectedBids || 0} rejected bids`
    }
  ] : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleQuickAction = (action) => {
    setActiveAction(action);
    // Navigate to different tabs using the callback from parent
    if (onTabChange) {
      switch(action) {
        case 'browse':
          onTabChange('browse');
          break;
        case 'bids':
          onTabChange('bids');
          break;
        case 'profile':
          onTabChange('profile');
          break;
        default:
          break;
      }
    }
  };

  if (statsLoading || projectsLoading || availableLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Freelancer'}! 👋</h1>
        <p className="text-green-100">Ready to take on new challenges and grow your career?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
            <div className="text-xs text-green-600">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Active Projects</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={() => onTabChange && onTabChange('awarded')}>
              View All
            </button>
          </div>
          <div className="space-y-4">
            {projects.length > 0 ? projects.map((project) => (
              <div key={project._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{project.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Client:</span> {project.clientId?.name || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Budget:</span> ${project.budget}
                  </div>
                  <div>
                    <span className="font-medium">Deadline:</span> {formatDate(project.deadline)}
                  </div>
                </div>
                {project.status === 'in-progress' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-800 font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="mx-auto mb-2" size={48} />
                <p>No active projects yet</p>
                <p className="text-sm">Start bidding on projects to see them here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleQuickAction('browse')}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center ${
                  activeAction === 'browse' ? 'bg-blue-800' : ''
                }`}
              >
                <Search className="mr-2" size={16} />
                Browse Projects
              </button>
              <button 
                onClick={() => handleQuickAction('bids')}
                className={`w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center ${
                  activeAction === 'bids' ? 'bg-green-800' : ''
                }`}
              >
                <Briefcase className="mr-2" size={16} />
                View My Bids ({statsData?.pendingBids || 0} pending)
              </button>
              <button 
                onClick={() => handleQuickAction('profile')}
                className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center ${
                  activeAction === 'profile' ? 'bg-purple-800' : ''
                }`}
              >
                <Star className="mr-2" size={16} />
                Update Profile
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Star className="text-yellow-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Performance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Client Rating</span>
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-1" size={14} />
                  <span className="font-medium">
                    {statsData?.averageRating ? `${statsData.averageRating}/5.0` : '4.5/5.0 (default)'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="font-medium">
                  {statsData?.responseTime || '< 24 hours'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium">
                  {statsData?.completionRate ? `${statsData.completionRate}%` : `${statsData?.successRate || 95}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-blue-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800">New project match!</div>
                <div className="text-xs text-gray-600">React Dashboard Development</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800">Payment received</div>
                <div className="text-xs text-gray-600">$800 for Mobile App UI Design</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800">Deadline reminder</div>
                <div className="text-xs text-gray-600">E-commerce project due in 3 days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Projects */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recommended Projects</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" onClick={() => onTabChange && onTabChange('browse')}>
            Browse All Projects
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableProjects.length > 0 ? availableProjects.map((project) => (
            <div key={project._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <h3 className="font-medium text-gray-800 mb-2">{project.title}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Budget:</span>
                  <span className="font-medium text-green-600">${project.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deadline:</span>
                  <span className="font-medium">{formatDate(project.deadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bids:</span>
                  <span className="font-medium">{project.bidsCount || 0}</span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                Submit Proposal
              </button>
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              <Search className="mx-auto mb-2" size={48} />
              <p>No projects available at the moment</p>
              <p className="text-sm">Check back later for new opportunities!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerHome;
