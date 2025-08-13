import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  Search, 
  Users, 
  Briefcase, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Globe,
  Code,
  Palette,
  Pen,
  Camera,
  Music
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      switch (userRole) {
        case 'client':
          navigate('/client');
          break;
        case 'freelancer':
          navigate('/freelancer');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/signup');
      }
    } else {
      navigate('/signup');
    }
  };

  const stats = [
    { label: 'Active Projects', value: '10,000+', icon: Briefcase },
    { label: 'Freelancers', value: '50,000+', icon: Users },
    { label: 'Completed Jobs', value: '100,000+', icon: CheckCircle },
    { label: 'Client Satisfaction', value: '98%', icon: Star }
  ];

  const features = [
    {
      title: 'Post Projects',
      description: 'Describe your project and get bids from qualified freelancers',
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Talent',
      description: 'Find skilled freelancers across various categories',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Secure Payments',
      description: 'Safe and secure payment processing for all transactions',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our round-the-clock support',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const categories = [
    { name: 'Web Development', icon: Code, jobs: '1,200+' },
    { name: 'Graphic Design', icon: Palette, jobs: '800+' },
    { name: 'Content Writing', icon: Pen, jobs: '950+' },
    { name: 'Photography', icon: Camera, jobs: '600+' },
    { name: 'Digital Marketing', icon: Globe, jobs: '700+' },
    { name: 'Music & Audio', icon: Music, jobs: '400+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Perfect
              <span className="text-yellow-300"> Freelancer</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with talented professionals from around the world. 
              Post your project and get quality work delivered on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="ml-2" size={20} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors duration-200"
              >
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <stat.icon className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose SoloGrind?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in the freelance marketplace
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore projects across different skill sets
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <category.icon className="text-blue-600" size={24} />
                  </div>
                  <span className="text-sm text-gray-500">{category.jobs}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100">
              Getting started is simple and straightforward
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Your Project</h3>
              <p className="text-blue-100">Describe what you need done and set your budget</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Freelancer</h3>
              <p className="text-blue-100">Review bids and select the best freelancer for your project</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Work Done</h3>
              <p className="text-blue-100">Collaborate and get your project completed on time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied clients and freelancers on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Join as Client
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            >
              Join as Freelancer
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
