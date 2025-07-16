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
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex gap-4 flex-wrap">
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
            className={`px-4 py-2 rounded ${
              activeTab === item.key ? 'bg-blue-600 text-white' : 'bg-white border'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">{renderTab()}</div>
    </div>
  )
}

export default FreelancerDashboard
