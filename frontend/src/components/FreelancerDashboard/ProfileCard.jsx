import React from 'react'
import { Link } from 'react-router-dom'

const ProfileCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
      <Link to="/freelancer/profile" className="text-blue-600 hover:underline">Go to Profile Settings</Link>
    </div>
  )
}

export default ProfileCard
