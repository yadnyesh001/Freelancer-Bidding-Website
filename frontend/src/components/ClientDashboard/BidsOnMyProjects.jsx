import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  CheckCircle, 
  X,
  MessageCircle,
  User,
  Mail,
  Award,
  Clock
} from "lucide-react";

const BidsOnMyProjects = ({ projectId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: bidsData, isLoading, error } = useQuery({
    queryKey: ['project-bids', projectId, currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(`/bid/project/${projectId}?page=${currentPage}&limit=5`);
      return response.data;
    },
    enabled: !!projectId
  });

  const acceptBidMutation = useMutation({
    mutationFn: async (bidId) => {
      const response = await axiosInstance.post(`/bid/award/${bidId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Bid accepted successfully!");
      queryClient.invalidateQueries(['project-bids', projectId]);
      queryClient.invalidateQueries(['my-projects']);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to accept bid";
      toast.error(errorMessage);
    }
  });

  const rejectBidMutation = useMutation({
    mutationFn: async (bidId) => {
      const response = await axiosInstance.post(`/bid/${bidId}/reject`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Bid rejected successfully!");
      queryClient.invalidateQueries(['project-bids', projectId]);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to reject bid";
      toast.error(errorMessage);
    }
  });

  const startConversationMutation = useMutation({
    mutationFn: async (receiverId) => {
      const response = await axiosInstance.post('/message/conversations/start', { 
        receiverId,
        projectId 
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Conversation started! Check your messages.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || "Failed to start conversation";
      toast.error(errorMessage);
    }
  });

  const handleAcceptBid = (bidId) => {
    if (window.confirm("Are you sure you want to accept this bid? This will award the project to this freelancer.")) {
      acceptBidMutation.mutate(bidId);
    }
  };

  const handleRejectBid = (bidId) => {
    if (window.confirm("Are you sure you want to reject this bid?")) {
      rejectBidMutation.mutate(bidId);
    }
  };

  const handleStartConversation = (freelancerId) => {
    startConversationMutation.mutate(freelancerId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading bids...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">
          Error loading bids: {error.response?.data?.message || error.message}
        </div>
      </div>
    );
  }

  const { bids = [], totalPages = 1, currentPage: serverCurrentPage = 1 } = bidsData || {};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-lg mr-3">
          <Users className="text-blue-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Bids Received</h2>
          <p className="text-sm text-gray-600">{bids.length} bid{bids.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No bids yet</h3>
          <p className="text-gray-600">Your project is live and waiting for freelancers to submit bids.</p>
        </div>
      ) : (
        <>
          {/* Bids List */}
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                {/* Bid Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      <User className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{bid.freelancer?.name || "Anonymous"}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="mr-1" size={14} />
                        {bid.freelancer?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {bid.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Bid Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <DollarSign className="text-green-600 mr-2" size={16} />
                    <div>
                      <div className="font-medium text-gray-800">${bid.amount}</div>
                      <div className="text-gray-500">Bid Amount</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="text-blue-600 mr-2" size={16} />
                    <div>
                      <div className="font-medium text-gray-800">{new Date(bid.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-500">Submitted</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="text-orange-600 mr-2" size={16} />
                    <div>
                      <div className="font-medium text-gray-800">{bid.deliveryTime || "Not specified"}</div>
                      <div className="text-gray-500">Delivery Time</div>
                    </div>
                  </div>
                </div>

                {/* Bid Message */}
                {bid.message && (
                  <div className="mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <MessageCircle className="text-gray-400 mr-2 mt-1" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Proposal:</div>
                          <p className="text-sm text-gray-600">{bid.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Freelancer Stats */}
                {bid.freelancer && (
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-1" size={16} />
                      <span className="text-gray-600">
                        {bid.freelancer.rating || "No rating"} 
                        {bid.freelancer.reviewCount && ` (${bid.freelancer.reviewCount} reviews)`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="text-purple-600 mr-1" size={16} />
                      <span className="text-gray-600">
                        {bid.freelancer.completedProjects || 0} projects completed
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {bid.status === "pending" && (
                  <div className="flex space-x-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleAcceptBid(bid._id)}
                      disabled={acceptBidMutation.isPending}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {acceptBidMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="mr-2" size={16} />
                      )}
                      Accept Bid
                    </button>
                    <button
                      onClick={() => handleRejectBid(bid._id)}
                      disabled={rejectBidMutation.isPending}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {rejectBidMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <X className="mr-2" size={16} />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleStartConversation(bid.freelancer._id)}
                      disabled={startConversationMutation.isPending}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {startConversationMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <MessageCircle className="mr-2" size={16} />
                      )}
                      Message
                    </button>
                  </div>
                )}
                
                {bid.status !== "pending" && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {bid.status === "accepted" && "✅ This bid has been accepted"}
                        {bid.status === "rejected" && "❌ This bid has been rejected"}
                      </div>
                      <button
                        onClick={() => handleStartConversation(bid.freelancer._id)}
                        disabled={startConversationMutation.isPending}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                      >
                        {startConversationMutation.isPending ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        ) : (
                          <MessageCircle className="mr-1" size={12} />
                        )}
                        Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BidsOnMyProjects;
