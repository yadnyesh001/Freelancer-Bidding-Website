import React from 'react'

const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-10">
      <div className="bg-blue-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Total Bids</h2>
        <p className="text-2xl">{stats.totalBids}</p>
      </div>
      <div className="bg-green-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Projects Awarded</h2>
        <p className="text-2xl">{stats.awarded}</p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Total Earnings</h2>
        <p className="text-2xl">₹{stats.earnings}</p>
      </div>
    </div>
  )
}

export default Stats
