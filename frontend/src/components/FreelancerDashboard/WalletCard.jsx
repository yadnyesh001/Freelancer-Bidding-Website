import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../lib/axios';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const WalletCard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['freelancer-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/freelancer/stats');
      return data;
    }
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/transaction/my');
      return data.slice(0, 5); // Get only recent 5 transactions
    }
  });

  if (isLoading || transactionsLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Total Earnings</h2>
          <DollarSign size={24} />
        </div>
        <div className="text-3xl font-bold mb-2">${stats?.totalEarnings || 0}</div>
        <div className="text-green-100 text-sm">
          {stats?.completedProjects || 0} completed projects
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-xl font-bold text-gray-800">
                ${((stats?.awardedProjects - stats?.completedProjects) * 500) || 0}
              </p>
            </div>
            <Calendar className="text-blue-500" size={20} />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-800">
                ${Math.floor((stats?.totalEarnings || 0) * 0.2)}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {transactions.length > 0 ? transactions.map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'payment' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'payment' ? 
                    <ArrowUpRight className="text-green-600" size={16} /> :
                    <ArrowDownLeft className="text-red-600" size={16} />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {transaction.projectId?.title || 'Project Payment'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className={`font-semibold ${
                transaction.type === 'payment' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'payment' ? '+' : '-'}${transaction.amount}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="mx-auto mb-2" size={48} />
              <p>No transactions yet</p>
              <p className="text-sm">Complete projects to see your earnings here</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Settings</h3>
        <div className="space-y-3">
          <button className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Add Payment Method</p>
                <p className="text-sm text-gray-600">Set up bank account or PayPal</p>
              </div>
              <ArrowUpRight size={16} />
            </div>
          </button>
          
          <button className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 text-left">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Withdrawal Request</p>
                <p className="text-sm text-gray-600">Request payout of available balance</p>
              </div>
              <ArrowUpRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
