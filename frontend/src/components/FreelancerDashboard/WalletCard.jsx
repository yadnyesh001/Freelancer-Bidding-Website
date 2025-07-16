import React from 'react'
import { Link } from 'react-router-dom'

const WalletCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Wallet & Payments</h2>
      <Link to="/freelancer/wallet" className="text-blue-600 hover:underline">Manage Wallet</Link>
    </div>
  )
}

export default WalletCard
