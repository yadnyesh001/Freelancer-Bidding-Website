import React, { useState } from 'react'
import axios from 'axios'

const BrowseProjects = ({ projects }) => {
  const [bidInputs, setBidInputs] = useState({})
  const [bidStatus, setBidStatus] = useState({}) // { [projectId]: "already_bid" | "success" | "error" }

  const handleInputChange = (projectId, field, value) => {
    setBidInputs((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }))
  }

  const handlePlaceBid = async (projectId) => {
    const bid = bidInputs[projectId]
    if (!bid?.amount || !bid?.description) {
      return alert('Please provide amount and description')
    }

    try {
      const res = await axios.post(`/api/v1/bid/${projectId}`, {
        amount: bid.amount,
        description: bid.description,
      })

      setBidStatus((prev) => ({
        ...prev,
        [projectId]: 'success',
      }))
    } catch (err) {
      if (
        err.response?.data?.message ===
        'You have already placed a bid on this project'
      ) {
        setBidStatus((prev) => ({
          ...prev,
          [projectId]: 'already_bid',
        }))
      } else {
        setBidStatus((prev) => ({
          ...prev,
          [projectId]: 'error',
        }))
      }
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Available Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available at the moment.</p>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => {
            const input = bidInputs[project._id] || {}
            const status = bidStatus[project._id]

            return (
              <div
                key={project._id}
                className="bg-white border rounded-lg p-6 shadow"
              >
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Budget: ₹{project.budget} | Deadline: {project.deadline}
                </p>
                <p className="text-gray-700 mb-3">{project.description}</p>

                {status === 'success' ? (
                  <p className="text-green-600 font-medium">
                    ✅ Bid placed successfully!
                  </p>
                ) : status === 'already_bid' ? (
                  <p className="text-yellow-600 font-medium">
                    ⚠️ You have already placed a bid on this project
                  </p>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Bid Amount"
                      className="w-full border px-3 py-2 rounded"
                      value={input.amount || ''}
                      onChange={(e) =>
                        handleInputChange(
                          project._id,
                          'amount',
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      rows="3"
                      placeholder="Your bid description"
                      className="w-full border px-3 py-2 rounded"
                      value={input.description || ''}
                      onChange={(e) =>
                        handleInputChange(
                          project._id,
                          'description',
                          e.target.value
                        )
                      }
                    ></textarea>
                    <button
                      onClick={() => handlePlaceBid(project._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Submit Bid
                    </button>
                    {status === 'error' && (
                      <p className="text-red-600">
                        ❌ Something went wrong. Try again.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default BrowseProjects
