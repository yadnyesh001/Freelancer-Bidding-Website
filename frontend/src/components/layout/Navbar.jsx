import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext.jsx'
import axios from 'axios'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, userRole, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/auth/logout', {}, { withCredentials: true })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      closeMenu()
      navigate('/')
    }
  }

  const handleLoginClick = () => {
    closeMenu()
    navigate('/login')
  }

  const handleSignUpClick = () => {
    closeMenu()
    navigate('/signup')
  }

  const goToHomeByRole = () => {
    if (!isLoggedIn) return navigate('/')
    if (userRole === 'admin') return navigate('/admin')
    if (userRole === 'client') return navigate('/client')
    if (userRole === 'freelancer') return navigate('/freelancer')
    return navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={goToHomeByRole}
            className="cursor-pointer flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="hidden sm:block">SoloGrind</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={goToHomeByRole}
              className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a
              href="/projects"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="/freelancers"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
            >
              Freelancers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {userRole && (
                  <span className="text-sm text-gray-600 capitalize">
                    {userRole}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="cursor-pointer text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 rounded-lg p-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2 mb-4">
            <button
              onClick={() => {
                closeMenu()
                goToHomeByRole()
              }}
              className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg font-medium transition-all duration-200"
            >
              Home
            </button>
            <a
              href="/projects"
              onClick={closeMenu}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg font-medium transition-all duration-200"
            >
              Projects
            </a>
            <a
              href="/freelancers"
              onClick={closeMenu}
              className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg font-medium transition-all duration-200"
            >
              Freelancers
            </a>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <div className="space-y-2">
                  {userRole && (
                    <div className="text-center text-sm text-gray-600 capitalize px-4 py-2">
                      Logged in as {userRole}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center px-4 py-2 text-gray-700 hover:text-red-600 border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-red-50 hover:border-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="block w-full text-center px-4 py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:border-blue-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleSignUpClick}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
