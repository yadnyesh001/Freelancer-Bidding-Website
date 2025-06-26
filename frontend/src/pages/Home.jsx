import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Shield, Zap, Users, Briefcase, CreditCard, CheckCircle, ArrowRight, Menu, X, Globe, Code, Palette, Camera, PenTool, Megaphone, BarChart3, Headphones } from 'lucide-react';

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SoloGrind
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Reviews</a>
            <button 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </button>
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              onClick={() => window.location.href = '/signup'}
            >
              Sign Up Free
            </button>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium">Reviews</a>
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium text-left"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </button>
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium w-fit"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up Free
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({ projects: 0, freelancers: 0, clients: 0 });

  // Animated stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        projects: prev.projects < 15420 ? prev.projects + 127 : 15420,
        freelancers: prev.freelancers < 8930 ? prev.freelancers + 73 : 8930,
        clients: prev.clients < 5240 ? prev.clients + 42 : 5240
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { icon: Code, name: "Web Development", projects: "2.1k+" },
    { icon: Users, name: "Mobile App Development", projects: "1.8k+" },
    { icon: Palette, name: "UI/UX Design", projects: "1.6k+" },
    { icon: Megaphone, name: "Digital Marketing", projects: "1.5k+" },
    { icon: Briefcase, name: "Game Development", projects: "980+" },
    { icon: PenTool, name: "Data Entry", projects: "1.3k+" },
    { icon: BarChart3, name: "Business Consulting", projects: "760+" },
    { icon: Globe, name: "Data Science", projects: "920+" },
    { icon: Shield, name: "Cybersecurity", projects: "640+" },
    { icon: Camera, name: "Video Editing", projects: "840+" },
    { icon: Zap, name: "AI & Machine Learning", projects: "720+" }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Messaging",
      description: "Instant communication with built-in chat, file sharing, and video calls"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Escrow protection, milestone payments, and instant withdrawals"
    },
    {
      icon: Star,
      title: "Smart Matching",
      description: "AI-powered project matching based on skills and preferences"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get proposals within hours, not days with our rapid bidding system"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      text: "SoloGrind transformed my freelance career. The real-time messaging and secure payments make everything seamless.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Tech Startup CEO", 
      text: "Found incredible talent here. The project management tools and communication features are game-changers.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Elena Rodriguez",
      role: "Content Writer",
      text: "The feedback system and payment protection give me confidence in every project I take on.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Where Talent Meets
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with top freelancers or find your next project on the platform that prioritizes 
              real-time collaboration, secure payments, and meaningful partnerships.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/signup'}
              >
                <Users className="w-5 h-5" />
                <span>I'm a Client</span>
              </button>
              <button 
                className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                onClick={() => window.location.href = '/signup'}
              >
                <Briefcase className="w-5 h-5" />
                <span>I'm a Freelancer</span>
              </button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.projects.toLocaleString()}+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.freelancers.toLocaleString()}+</div>
                <div className="text-gray-600">Active Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{stats.clients.toLocaleString()}+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600">Discover talented freelancers across every category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <service.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.projects} projects</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SoloGrind?</h2>
            <p className="text-xl text-gray-600">Built for the modern freelance economy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SoloGrind Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes, not hours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Post or Browse</h3>
              <p className="text-gray-600">Clients post projects, freelancers browse and submit proposals with real-time notifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate</h3>
              <p className="text-gray-600">Use our integrated messaging, file sharing, and milestone tracking to work together seamlessly</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Paid</h3>
              <p className="text-gray-600">Secure escrow payments, feedback exchange, and instant withdrawals protect everyone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Real feedback from real users</p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                  {testimonials[activeTestimonial].avatar}
                </div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                <div className="font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers and clients who trust SoloGrind for their projects
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              onClick={() => window.location.href = '/signup'}
            >
              <span>Start as Client</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center space-x-2"
              onClick={() => window.location.href = '/signup'}
            >
              <span>Join as Freelancer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SoloGrind</span>
              </div>
              <p className="text-gray-400">
                The future of freelancing is here. Connect, collaborate, and create amazing projects together.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Post Projects</li>
                <li>Find Freelancers</li>
                <li>Project Management</li>
                <li>Secure Payments</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Browse Jobs</li>
                <li>Build Portfolio</li>
                <li>Get Reviews</li>
                <li>Earn More</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SoloGrind. All rights reserved. Built for the future of work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;