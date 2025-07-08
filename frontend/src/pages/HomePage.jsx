import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">SoloGrind</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Connect with top freelancers and grow your business or career.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Post a Project
          </Link>
          <Link
            to="/signup"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded hover:bg-blue-100 transition"
          >
            Find Freelancers
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Create an Account</h3>
            <p className="text-gray-600">Sign up as a client or freelancer in minutes.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">2. Post or Browse Projects</h3>
            <p className="text-gray-600">Clients post projects, freelancers bid on work they love.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">3. Get Work Done</h3>
            <p className="text-gray-600">Collaborate, complete, and pay securely through SoloGrind.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
