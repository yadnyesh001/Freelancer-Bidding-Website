import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { 
  BarChart, 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Star,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

const Stats = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['client-stats'],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/client/stats");
      return response.data;
    }
  });

  // Mock data for demonstration - replace with actual API data
  const mockStats = {
    totalProjects: 15,
    totalBidsReceived: 287,
    totalSpent: 12450,
    completedProjects: 8,
    activeProjects: 5,
    averageRating: 4.7,
    responseTime: "2.3 hours",
    successRate: 89
  };

  const chartData = [
    { month: "Jan", projects: 2, spent: 1200 },
    { month: "Feb", projects: 3, spent: 2100 },
    { month: "Mar", projects: 1, spent: 800 },
    { month: "Apr", projects: 4, spent: 3200 },
    { month: "May", projects: 2, spent: 1500 },
    { month: "Jun", projects: 3, spent: 2650 }
  ];

  const displayStats = stats || mockStats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">
          Error loading statistics: {error.response?.data?.message || error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="bg-purple-100 p-3 rounded-lg mr-4">
          <BarChart className="text-purple-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Statistics & Analytics</h1>
          <p className="text-gray-600">Track your project performance and hiring metrics</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="text-blue-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{displayStats.totalProjects}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
          <div className="text-xs text-green-600 mt-1">+20% this month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="text-green-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{displayStats.totalBidsReceived}</div>
          <div className="text-sm text-gray-600">Bids Received</div>
          <div className="text-xs text-green-600 mt-1">+15% this month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">${displayStats.totalSpent?.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-xs text-green-600 mt-1">+8% this month</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <CheckCircle className="text-orange-600" size={20} />
            </div>
            <TrendingUp className="text-green-500" size={16} />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{displayStats.completedProjects}</div>
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-xs text-green-600 mt-1">+25% this month</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800">{displayStats.completedProjects}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 ml-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(displayStats.completedProjects / displayStats.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800">{displayStats.activeProjects}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 ml-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(displayStats.activeProjects / displayStats.totalProjects) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">In Review</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800">2</span>
                <div className="w-24 bg-gray-200 rounded-full h-2 ml-3">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '13%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Rating & Performance */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-2" size={18} />
                <span className="text-sm text-gray-600">Average Rating</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{displayStats.averageRating}/5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="text-blue-500 mr-2" size={18} />
                <span className="text-sm text-gray-600">Avg Response Time</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{displayStats.responseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="text-green-500 mr-2" size={18} />
                <span className="text-sm text-gray-600">Success Rate</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">{displayStats.successRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h3>
        <div className="overflow-x-auto">
          <div className="flex items-end space-x-4 h-64">
            {chartData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex flex-col items-center justify-end h-48 w-full">
                  <div 
                    className="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(data.projects / 4) * 100}%` }}
                    title={`${data.projects} projects`}
                  ></div>
                  <div 
                    className="bg-green-500 rounded-t w-8 ml-2 transition-all duration-300 hover:bg-green-600"
                    style={{ height: `${(data.spent / 3200) * 100}%` }}
                    title={`$${data.spent} spent`}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-2">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">Projects</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">Spending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Insights & Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">💡 Optimization Tip</h4>
            <p className="text-sm text-gray-600">
              Your response time is excellent! Clients appreciate quick communication. 
              Consider posting more detailed project descriptions to attract higher quality bids.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">🎯 Next Goal</h4>
            <p className="text-sm text-gray-600">
              You're close to reaching 10 completed projects! This milestone will boost your 
              credibility and help attract top freelancers to your future projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
