import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageCircle, Shield, Zap, Users, Briefcase, CreditCard, CheckCircle, ArrowRight, Menu, X, Globe, Code, Palette, Camera, PenTool, Megaphone, BarChart3, Headphones } from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({ projects: 0, freelancers: 0, clients: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers = [];
    const refs = [
      { ref: heroRef, key: 'hero' },
      { ref: servicesRef, key: 'services' },
      { ref: featuresRef, key: 'features' },
      { ref: testimonialsRef, key: 'testimonials' }
    ];

    refs.forEach(({ ref, key }) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIsVisible(prev => ({ ...prev, [key]: entry.isIntersecting }));
          },
          { threshold: 0.1, rootMargin: '50px' }
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

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
    { icon: Code, name: "Web Development", projects: "2.1k+", color: "from-blue-500 to-cyan-500" },
    { icon: Users, name: "Mobile App Development", projects: "1.8k+", color: "from-purple-500 to-pink-500" },
    { icon: Palette, name: "UI/UX Design", projects: "1.6k+", color: "from-green-500 to-emerald-500" },
    { icon: Megaphone, name: "Digital Marketing", projects: "1.5k+", color: "from-orange-500 to-red-500" },
    { icon: Briefcase, name: "Game Development", projects: "980+", color: "from-violet-500 to-purple-500" },
    { icon: PenTool, name: "Data Entry", projects: "1.3k+", color: "from-teal-500 to-cyan-500" },
    { icon: BarChart3, name: "Business Consulting", projects: "760+", color: "from-indigo-500 to-blue-500" },
    { icon: Globe, name: "Data Science", projects: "920+", color: "from-pink-500 to-rose-500" },
    { icon: Shield, name: "Cybersecurity", projects: "640+", color: "from-red-500 to-orange-500" },
    { icon: Camera, name: "Video Editing", projects: "840+", color: "from-yellow-500 to-orange-500" },
    { icon: Zap, name: "AI & Machine Learning", projects: "720+", color: "from-cyan-500 to-blue-500" }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Messaging",
      description: "Instant communication with built-in chat, file sharing, and video calls",
      delay: "0ms"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Escrow protection, milestone payments, and instant withdrawals",
      delay: "100ms"
    },
    {
      icon: Star,
      title: "Smart Matching",
      description: "AI-powered project matching based on skills and preferences",
      delay: "200ms"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get proposals within hours, not days with our rapid bidding system",
      delay: "300ms"
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

  // Floating orbs component
  const FloatingOrbs = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-20 animate-pulse`}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 30}%`,
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            background: `linear-gradient(45deg, ${i % 2 ? '#3B82F6' : '#8B5CF6'}, ${i % 2 ? '#06B6D4' : '#EC4899'})`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + i * 0.5}s`
          }}
        />
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Cursor follower */}
      <div 
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none opacity-20 z-50 transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(0.8)'
        }}
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
        <FloatingOrbs />
        
        <div className="max-w-7xl mx-auto relative w-full">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ease-out ${
              isVisible.hero 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent animate-pulse">
              Where Talent Meets
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Opportunity
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-lg animate-pulse"></div>
              </span>
            </h1>
            
            <p 
              className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
                isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Connect with top freelancers or find your next project on the platform that prioritizes 
              real-time collaboration, secure payments, and meaningful partnerships.
            </p>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-500 ${
                isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <button 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden"
                onClick={() => window.location.href = '/signup'}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Users className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>I'm a Client</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </button>
              
              <button 
                className="group bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center justify-center space-x-2 relative"
                onClick={() => window.location.href = '/signup'}
              >
                <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>I'm a Freelancer</span>
              </button>
            </div>

            {/* Animated Stats */}
            <div 
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-700 ${
                isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              {[
                { value: stats.projects, label: "Projects Completed", color: "text-blue-600", suffix: "+" },
                { value: stats.freelancers, label: "Active Freelancers", color: "text-purple-600", suffix: "+" },
                { value: stats.clients, label: "Happy Clients", color: "text-indigo-600", suffix: "+" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`text-3xl font-bold ${stat.color} group-hover:animate-pulse`}>
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section 
        ref={servicesRef}
        id="services" 
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-xl text-gray-600">Discover talented freelancers across every category</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className={`group bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 relative overflow-hidden ${
                  isVisible.services 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600">{service.projects} projects</p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-7xl mx-auto relative">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SoloGrind?</h2>
            <p className="text-xl text-gray-600">Built for the modern freelance economy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`text-center group transition-all duration-700 ${
                  isVisible.features 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: feature.delay }}
              >
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <feature.icon className="w-10 h-10 text-blue-600 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How SoloGrind Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes, not hours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-10 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30"></div>
            <div className="hidden md:block absolute top-10 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-30"></div>
            
            {[
              {
                step: 1,
                title: "Post or Browse",
                description: "Clients post projects, freelancers browse and submit proposals with real-time notifications",
                color: "bg-blue-600",
                delay: "0ms"
              },
              {
                step: 2,
                title: "Collaborate",
                description: "Use our integrated messaging, file sharing, and milestone tracking to work together seamlessly",
                color: "bg-purple-600",
                delay: "200ms"
              },
              {
                step: 3,
                title: "Get Paid",
                description: "Secure escrow payments, feedback exchange, and instant withdrawals protect everyone",
                color: "bg-indigo-600",
                delay: "400ms"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center relative group"
                style={{ animationDelay: item.delay }}
              >
                <div className={`relative w-20 h-20 ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
                  <span className="relative z-10">{item.step}</span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        ref={testimonialsRef}
        id="testimonials" 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600">Real feedback from real users</p>
          </div>

          <div 
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="text-center relative z-10">
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
                  <span className="relative z-10">{testimonials[activeTestimonial].avatar}</span>
                </div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-current hover:scale-125 transition-transform duration-200" 
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                
                <blockquote className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                <div className="font-semibold text-gray-900 mb-1">
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
                  className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === activeTestimonial 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6 animate-pulse">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of freelancers and clients who trust SoloGrind for their projects
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="group bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden"
              onClick={() => window.location.href = '/signup'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10">Start as Client</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button 
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
              onClick={() => window.location.href = '/signup'}
            >
              <span>Join as Freelancer</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SoloGrind</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of freelancing is here. Connect, collaborate, and create amazing projects together.
              </p>
            </div>
            
            {[
              {
                title: "For Clients",
                items: ["Post Projects", "Find Freelancers", "Project Management", "Secure Payments"]
              },
              {
                title: "For Freelancers", 
                items: ["Browse Jobs", "Build Portfolio", "Get Reviews", "Earn More"]
              },
              {
                title: "Support",
                items: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.items.map((item, itemIndex) => (
                    <li 
                      key={itemIndex}
                      className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer hover:translate-x-1 transform transition-transform"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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