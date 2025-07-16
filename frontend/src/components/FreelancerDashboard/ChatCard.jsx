import React from 'react'
import { Link } from 'react-router-dom'

const ChatCard = () => {
  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <Link to="/chat" className="text-blue-600 hover:underline">Open Chat with Clients</Link>
    </div>
  )
}

export default ChatCard
