import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          SoloGrind
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/projects" className="text-gray-700 hover:text-blue-600 transition">
            Projects
          </Link>
          <Link to="/freelancers" className="text-gray-700 hover:text-blue-600 transition">
            Freelancers
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
