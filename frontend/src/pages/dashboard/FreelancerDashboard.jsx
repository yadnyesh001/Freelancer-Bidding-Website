import React, { useEffect, useState } from 'react'
import Stats from '../../components/FreelancerDashboard/Stats.jsx'
import MyBids from '../../components/FreelancerDashboard/MyBids.jsx'
import AwardedProjects from '../../components/FreelancerDashboard/AwardedProjects.jsx'
import WalletCard from '../../components/FreelancerDashboard/WalletCard.jsx'
import ChatCard from '../../components/FreelancerDashboard/ChatCard.jsx'
import ProfileCard from '../../components/FreelancerDashboard/ProfileCard.jsx'
import BrowseProjects from '../../components/FreelancerDashboard/BrowseProjects.jsx'
import { useAuth } from '../../AuthContext.jsx'
import axios from 'axios'

const FreelancerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('home')

  const [stats, setStats] = useState({ totalBids: 0, awarded: 0, earnings: 0 })
  const [bids, setBids] = useState([])
  const [awarded, setAwarded] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchStats()
    fetchBids()
    fetchAwarded()
    fetchProjects()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/freelancer/stats')
      setStats(res.data)
    } catch (err) {
      console.error('Stats Error:', err)
    }
  }

  const fetchBids = async () => {
    try {
      const res = await axios.get('/api/bids/my')
      setBids(res.data)
    } catch (err) {
      console.error('Bids Error:', err)
    }
  }

  const fetchAwarded = async () => {
    try {
      const res = await axios.get('/api/bids/awarded')
      setAwarded(res.data)
    } catch (err) {
      console.error('Awarded Error:', err)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/v1/project') // You can filter on backend if needed
      setProjects(res.data)
    } catch (err) {
      console.error('Projects Error:', err)
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'bids':
        return <MyBids bids={bids} />
      case 'awarded':
        return <AwardedProjects projects={awarded} />
      case 'chat':
        return <ChatCard />
      case 'wallet':
        return <WalletCard />
      case 'profile':
        return <ProfileCard />
      case 'browse':
        return <BrowseProjects projects={projects} />
      case 'home':
      default:
        return (
          <div>
            <h2 className="text-xl mb-4">Welcome, {user?.name} 👋</h2>
            <Stats stats={stats} />
          </div>
        )
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 md:w-64 sm:w-48 bg-white shadow-lg flex-shrink-0 hidden sm:block">
        <div className="p-4 md:p-6 border-b">
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Freelancer Dashboard</h1>
        </div>
        
        <nav className="mt-4 md:mt-6 overflow-y-auto h-[calc(100%-80px)]">
          {[
            { key: 'home', label: 'Home' },
            { key: 'bids', label: 'My Bids' },
            { key: 'awarded', label: 'Awarded Projects' },
            { key: 'browse', label: 'Browse Projects' },
            { key: 'chat', label: 'Chat' },
            { key: 'wallet', label: 'Wallet' },
            { key: 'profile', label: 'Profile' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-4 md:px-6 py-2 md:py-3 text-sm md:text-base transition-colors duration-200 ${
                activeTab === item.key
                  ? 'bg-blue-600 text-white border-r-4 border-blue-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden w-full bg-white shadow-sm border-b">
        <div className="flex overflow-x-auto p-2 gap-2">
          {[
            { key: 'home', label: 'Home' },
            { key: 'bids', label: 'Bids' },
            { key: 'awarded', label: 'Awarded' },
            { key: 'browse', label: 'Browse' },
            { key: 'chat', label: 'Chat' },
            { key: 'wallet', label: 'Wallet' },
            { key: 'profile', label: 'Profile' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-2 rounded text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === item.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 md:p-6 overflow-y-auto">
        {renderTab()}
      </div>
    </div>
  )
}

export default FreelancerDashboard