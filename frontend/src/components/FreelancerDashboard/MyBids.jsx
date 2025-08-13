import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

const MyBids = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const statusOptions = ['All', 'Pending', 'Accepted', 'Rejected'];

  // Fetch user's bids
  const { data: bidResponse, isLoading, error } = useQuery({
    queryKey: ['my-bids'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/bid/my');
      return data;
    }
  });

  const bids = bidResponse?.bids || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-yellow-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredBids = bids.filter(bid => {
    const matchesStatus = selectedStatus === 'All' || 
                         bid.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch = bid.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const sortedBids = [...filteredBids].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'amount-high':
        return (b.amount || 0) - (a.amount || 0);
      case 'amount-low':
        return (a.amount || 0) - (b.amount || 0);
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
        Error loading bids. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Bids</h1>
          <p className="text-gray-600 mt-1">Track your project proposals and their status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-600">{sortedBids.length} bids total</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bids</p>
              <p className="text-2xl font-bold text-gray-800">{bids.length}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bids.filter(bid => bid.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {bids.filter(bid => bid.status === 'accepted').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {bids.length > 0 ? Math.round((bids.filter(bid => bid.status === 'accepted').length / bids.length) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="text-blue-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search bids by project title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Bids List */}
      {sortedBids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Eye size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No bids found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Start browsing projects to submit your first bid!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBids.map(bid => (
            <div key={bid._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              {/* Bid Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                      {bid.project?.title || 'Project Title Not Available'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{bid.description}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {bid.project?.description || 'No project description available'}
                  </p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(bid.status)}
                </div>
              </div>

              {/* Bid Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span className="font-medium">Your Bid: ${bid.amount}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Submitted: {new Date(bid.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={16} className="mr-2" />
                  <span>Total Bids: {bid.project?.bids?.length || 'N/A'}</span>
                </div>
              </div>

              {/* Project Budget and Client Info */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
                    {bid.project?.postedBy?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">
                      {bid.project?.postedBy?.name || 'Anonymous Client'}
                    </div>
                    <div className="text-xs text-gray-600">
                      Project Budget: ${bid.project?.budget || 'Not specified'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    <ExternalLink size={16} className="mr-1" />
                    View Project
                  </button>
                  {bid.status === 'accepted' && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
                      Start Project
                    </button>
                  )}
                  {bid.status === 'pending' && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                      Edit Bid
                    </button>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {bid.status === 'accepted' && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    🎉 Congratulations! Your bid has been accepted. The client will contact you soon.
                  </p>
                </div>
              )}
              {bid.status === 'rejected' && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-red-800 text-sm">
                    Unfortunately, your bid was not selected for this project. Keep applying to other projects!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {sortedBids.length > 0 && (
        <div className="text-center">
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium">
            Load More Bids
          </button>
        </div>
      )}
    </div>
  );
};

export default MyBids;
