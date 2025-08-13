import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Briefcase,
  Star,
  Target,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Stats = () => {
  // Fetch freelancer statistics
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['freelancer-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/freelancer/stats');
      return data;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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
        <AlertCircle className="mx-auto mb-4" size={48} />
        <p>Error loading statistics. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h1>
          <p className="text-gray-600 mt-1">Track your performance and earnings</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatCurrency(stats?.totalEarnings || 0)}
          </div>
          <div className="text-sm text-gray-600 mb-2">Total Earnings</div>
          <div className="text-xs text-green-600">+15.2% from last month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stats?.completedProjects || 0}
          </div>
          <div className="text-sm text-gray-600 mb-2">Completed Projects</div>
          <div className="text-xs text-green-600">+{stats?.awardedProjects || 0} total awarded</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Target className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {stats?.successRate || 0}%
          </div>
          <div className="text-sm text-gray-600 mb-2">Success Rate</div>
          <div className="text-xs text-green-600">{stats?.acceptedBids || 0} accepted bids</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div className="text-gray-400">
              <Star size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">4.5</div>
          <div className="text-sm text-gray-600 mb-2">Average Rating</div>
          <div className="text-xs text-gray-600">Default rating (no reviews yet)</div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bid Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bid Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="text-blue-600 mr-2" size={16} />
                <span className="text-gray-700">Total Bids</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.totalBids || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-600 mr-2" size={16} />
                <span className="text-gray-700">Pending Bids</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.pendingBids || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2" size={16} />
                <span className="text-gray-700">Accepted Bids</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.acceptedBids || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="text-red-600 mr-2" size={16} />
                <span className="text-gray-700">Rejected Bids</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.rejectedBids || 0}</span>
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2" size={16} />
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.completedProjects || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Briefcase className="text-blue-600 mr-2" size={16} />
                <span className="text-gray-700">In Progress</span>
              </div>
              <span className="font-semibold text-gray-800">
                {(stats?.awardedProjects || 0) - (stats?.completedProjects || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Award className="text-purple-600 mr-2" size={16} />
                <span className="text-gray-700">Total Awarded</span>
              </div>
              <span className="font-semibold text-gray-800">{stats?.awardedProjects || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stats?.totalBids || 0}</div>
            <div className="text-blue-100">Total Proposals Submitted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{formatCurrency(stats?.totalEarnings || 0)}</div>
            <div className="text-blue-100">Total Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{stats?.successRate || 0}%</div>
            <div className="text-blue-100">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Tips for Improvement */}
      {(stats?.successRate || 0) < 50 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-600 mr-3" size={20} />
            <div>
              <h3 className="text-yellow-800 font-medium">Tips to Improve Your Success Rate</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Consider improving your proposals, updating your profile, or adjusting your pricing strategy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
