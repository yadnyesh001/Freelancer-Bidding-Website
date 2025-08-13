import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../AuthContext';
import { axiosInstance } from '../../lib/axios';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Star,
  Award,
  Briefcase,
  Calendar
} from 'lucide-react';

const ProfileCard = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    hourlyRate: ''
  });

  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/profile');
      return data;
    },
    onSuccess: (data) => {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bio: data.bio || '',
        skills: data.skills?.join(', ') || '',
        hourlyRate: data.hourlyRate || ''
      });
    }
  });

  // Fetch freelancer stats
  const { data: stats } = useQuery({
    queryKey: ['freelancer-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/auth/freelancer/stats');
      return data;
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosInstance.put('/auth/profile', {
        ...updatedData,
        skills: updatedData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      queryClient.invalidateQueries(['profile']);
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || '',
        hourlyRate: profile.hourlyRate || ''
      });
    }
  };

  if (isLoading) {
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
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mr-4">
            <User size={32} className="text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{profile?.name || 'Your Name'}</h3>
            <p className="text-gray-600">{profile?.role || 'Freelancer'}</p>
            <div className="flex items-center mt-1">
              <Star className="text-yellow-500 mr-1" size={16} />
              <span className="text-sm text-gray-600">4.8 rating</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center py-2">
                <User size={16} className="text-gray-400 mr-2" />
                <span>{profile?.name || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center py-2">
                <Mail size={16} className="text-gray-400 mr-2" />
                <span>{profile?.email || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center py-2">
                <Phone size={16} className="text-gray-400 mr-2" />
                <span>{profile?.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center py-2">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span>{profile?.location || 'Not provided'}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell clients about yourself..."
              />
            ) : (
              <p className="py-2 text-gray-600">
                {profile?.bio || 'No bio provided yet. Add a bio to attract more clients!'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma separated)
            </label>
            {isEditing ? (
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, Node.js, Python..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="py-2">
                {profile?.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">No skills listed</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate ($)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="py-2">
                <span className="text-lg font-semibold text-green-600">
                  ${profile?.hourlyRate || 0}/hour
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Briefcase className="mx-auto text-blue-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-800">{stats?.completedProjects || 0}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Award className="mx-auto text-green-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-800">{stats?.successRate || 0}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="mx-auto text-purple-600 mb-2" size={24} />
            <div className="text-2xl font-bold text-gray-800">
              {new Date(profile?.createdAt).getFullYear() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Member Since</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
