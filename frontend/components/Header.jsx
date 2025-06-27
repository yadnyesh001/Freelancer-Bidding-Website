import React, { useState, useEffect } from "react";
import { Zap, Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  // Track current path
  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    // Listen for route changes (if using client-side routing)
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveItem(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Check if current page is login or signup
  const isAuthPage = currentPath === '/login' || currentPath === '/signup';

  // Navigation items with animations
  const navItems = [
    { id: 'features', label: 'Features', hasDropdown: false },
    { id: 'services', label: 'Services', hasDropdown: false },
    { id: 'testimonials', label: 'Reviews', hasDropdown: false }
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 w-full overflow-hidden ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 group cursor-pointer flex-shrink-0" onClick={() => window.location.href = '/'}>
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-all duration-300"></div>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 whitespace-nowrap">
              SoloGrind
            </span>
            
            {/* Subtle glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-shrink-0">
            {/* Only show navigation items if not on auth pages */}
            {!isAuthPage && navItems.map((item, index) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-2 lg:px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-lg hover:bg-blue-50 flex items-center space-x-1 text-sm lg:text-base ${
                    activeItem === item.id ? 'text-blue-600 bg-blue-50' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 transition-transform group-hover:rotate-180" />}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Active indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                    activeItem === item.id ? 'w-full' : 'group-hover:w-full'
                  }`}></div>
                </button>
              </div>
            ))}

            {/* Auth buttons - show different buttons based on current page */}
            <div className="flex items-center space-x-1 lg:space-x-2 ml-2">
              {currentPath !== '/login' && (
                <button
                  className="relative px-2 lg:px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 rounded-lg hover:bg-gray-50 group overflow-hidden text-sm lg:text-base"
                  onClick={() => (window.location.href = "/login")}
                >
                  <span className="relative z-10 whitespace-nowrap">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}

              {currentPath !== '/signup' && (
                <button
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 lg:px-6 py-2 rounded-full font-medium hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden group text-sm lg:text-base"
                  onClick={() => (window.location.href = "/signup")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center space-x-1 lg:space-x-2">
                    <span className="whitespace-nowrap">Sign Up Free</span>
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-yellow-400 rounded-full animate-ping group-hover:animate-pulse flex-shrink-0"></div>
                  </span>
                  
                  {/* Ripple effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-white rounded-full opacity-20 group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button - only show if not on auth pages */}
          {!isAuthPage && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group relative overflow-hidden flex-shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                {isMenuOpen ? (
                  <X className="w-5 h-5 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
            </button>
          )}

          {/* Mobile auth buttons for auth pages */}
          {isAuthPage && (
            <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
              {currentPath !== '/login' && (
                <button
                  className="px-3 py-1 text-sm text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 whitespace-nowrap"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </button>
              )}
              {currentPath !== '/signup' && (
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Sign Up
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation - only show if not on auth pages */}
        {!isAuthPage && (
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 border-t border-gray-200/50">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 rounded-lg group relative overflow-hidden ${
                      activeItem === item.id ? 'text-blue-600 bg-blue-50' : ''
                    }`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `all 0.3s ease ${index * 50}ms`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}
                
                <button
                  className="text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 font-medium transition-all duration-300 rounded-lg group relative overflow-hidden"
                  onClick={() => (window.location.href = "/login")}
                  style={{ 
                    animationDelay: `${navItems.length * 50}ms`,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.3s ease ${navItems.length * 50}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Login</span>
                </button>
                
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium w-full hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden mt-2"
                  onClick={() => (window.location.href = "/signup")}
                  style={{ 
                    animationDelay: `${(navItems.length + 1) * 50}ms`,
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `all 0.3s ease ${(navItems.length + 1) * 50}ms`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Sign Up Free</span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -top-1 right-10 w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-pulse delay-500"></div>
      </div>

      {/* Progress bar for scroll */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
           style={{ width: `${Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%` }}>
      </div>
    </nav>
  );
};

export default Header;