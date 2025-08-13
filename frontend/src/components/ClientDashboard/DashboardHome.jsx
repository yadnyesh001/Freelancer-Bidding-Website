import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
  AlertCircle
} from 'lucide-react';

const DashboardHome = () => {
  // Fetch client stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['client-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/client/stats');
      return data;
    }
  });

  // Fetch client's projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['my-projects-preview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/project/my');
      return data.slice(0, 3); // Get only first 3 for preview
    }
  });

  // Fetch recent bids on projects
  const { data: bids = [], isLoading: bidsLoading } = useQuery({
    queryKey: ['project-bids-preview'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/bid/project-bids');
      return data.slice(0, 3); // Get only first 3 for preview
    }
  });

  const stats = statsData ? [
    {
      label: 'Active Projects',
      value: (statsData.totalProjects - statsData.completedProjects)?.toString() || '0',
      icon: Briefcase,
      color: 'bg-blue-500',
      change: `${statsData.totalProjects || 0} total projects`
    },
    {
      label: 'Total Bids',
      value: statsData.totalBidsReceived?.toString() || '0',
      icon: Users,
      color: 'bg-green-500',
      change: `${statsData.openProjects || 0} open projects`
    },
    {
      label: 'Completed Projects',
      value: statsData.completedProjects?.toString() || '0',
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: `${statsData.inProgressProjects || 0} in progress`
    },
    {
      label: 'Total Spent',
      value: `$${statsData.totalSpent || 0}`,
      icon: DollarSign,
      color: 'bg-orange-500',
      change: `${statsData.completedProjects || 0} completed`
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

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (statsLoading || projectsLoading || bidsLoading) {
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-blue-100">Manage your projects and track your progress from here.</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Budget:</span> ${project.budget}
                  </div>
                  <div>
                    <span className="font-medium">Bids:</span> {project.bidsCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Deadline:</span> {formatDate(project.deadline)}
                  </div>
                  <div>
                    <span className="font-medium">Freelancer:</span> {project.awardedTo?.name || 'Not assigned'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="mx-auto mb-2" size={48} />
                <p>No projects yet</p>
                <p className="text-sm">Create your first project to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Clock className="text-orange-500 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Deadlines</h2>
            </div>
            <div className="space-y-3">
              {projects.filter(project => project.status !== 'completed').length > 0 ? 
                projects
                  .filter(project => project.status !== 'completed')
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 3)
                  .map((project) => {
                    const daysLeft = getDaysUntilDeadline(project.deadline);
                    return (
                      <div key={project._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{project.title}</div>
                          <div className="text-xs text-gray-600">{formatDate(project.deadline)}</div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          daysLeft <= 1 ? 'bg-red-100 text-red-800' : 
                          daysLeft <= 3 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'Overdue'}
                        </div>
                      </div>
                    );
                  })
                : (
                  <div className="text-center py-4 text-gray-500">
                    <Calendar className="mx-auto mb-2" size={32} />
                    <p className="text-sm">No upcoming deadlines</p>
                  </div>
                )
              }
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                <Briefcase className="mr-2" size={16} />
                Post New Project
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center">
                <Users className="mr-2" size={16} />
                Browse Freelancers
              </button>
              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
                <Star className="mr-2" size={16} />
                Leave Reviews
              </button>
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
                <div className="text-sm font-medium text-gray-800">New bid received</div>
                <div className="text-xs text-gray-600">E-commerce Website project</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800">Project completed</div>
                <div className="text-xs text-gray-600">Mobile App UI Design</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800">Deadline approaching</div>
                <div className="text-xs text-gray-600">Content Writing project</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;