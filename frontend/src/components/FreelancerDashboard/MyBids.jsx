import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyBids = () => {
  const [bids, setBids] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingBidId, setEditingBidId] = useState(null)
  const [editInputs, setEditInputs] = useState({})

  const fetchBids = async (page = 1) => {
    try {
      setLoading(true)
      const res = await axios.get('/api/v1/bid/my')
      setBids(res.data.bids || [])
      setCurrentPage(res.data.currentPage || 1)
      setHasNextPage((res.data.bids || []).length === 10)
    } catch (err) {
      console.error('Error fetching my bids:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBids(currentPage)
  }, [])

  const handlePrev = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      fetchBids(newPage)
    }
  }

  const handleNext = () => {
    if (hasNextPage) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      fetchBids(newPage)
    }
  }

  const handleEdit = (bid) => {
    setEditingBidId(bid._id)
    setEditInputs({
      amount: bid.amount,
      description: bid.description || '',
    })
  }

  const handleCancelEdit = () => {
    setEditingBidId(null)
    setEditInputs({})
  }

  const handleSaveEdit = async (bidId) => {
    try {
      await axios.patch(`/api/v1/bid/${bidId}`, editInputs)
      setEditingBidId(null)
      setEditInputs({})
      fetchBids(currentPage)
    } catch (err) {
      alert('Update failed: ' + err.response?.data?.message || err.message)
    }
  }

  const handleDelete = async (bidId) => {
    const confirm = window.confirm('Are you sure you want to delete this bid?')
    if (!confirm) return

    try {
      await axios.delete(`/api/v1/bid/${bidId}`)
      fetchBids(currentPage)
    } catch (err) {
      alert('Delete failed: ' + err.response?.data?.message || err.message)
    }
  }

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">My Bids</h2>
      {loading ? (
        <p className="text-gray-500">Loading bids...</p>
      ) : bids.length === 0 ? (
        <p className="text-gray-500">No bids placed yet.</p>
      ) : (
        <>
          <div className="space-y-4">
            {bids.map((bid) => {
              const isEditing = editingBidId === bid._id
              const isDisabled =
                bid.status === 'accepted' || bid.awarded === true

              return (
                <div
                  key={bid._id}
                  className="bg-white p-4 shadow rounded-md border"
                >
                  <h3 className="text-lg font-semibold mb-1">
                    {bid.project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Deadline:{' '}
                    <span className="text-red-500">{bid.project.deadline}</span>
                  </p>

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        value={editInputs.amount}
                        onChange={(e) =>
                          setEditInputs({
                            ...editInputs,
                            amount: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="w-full border px-3 py-2 rounded"
                        rows="2"
                        value={editInputs.description}
                        onChange={(e) =>
                          setEditInputs({
                            ...editInputs,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(bid._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">
                        Bid Amount: ₹{bid.amount}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        Description: {bid.description || '—'}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{' '}
                        <span className="font-medium capitalize">
                          {bid.status}
                        </span>
                      </p>

                      <div className="flex gap-3 mt-2">
                        <button
                          disabled={isDisabled}
                          onClick={() => handleEdit(bid)}
                          className={`px-3 py-1 rounded text-sm ${
                            isDisabled
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          disabled={isDisabled}
                          onClick={() => handleDelete(bid._id)}
                          className={`px-3 py-1 rounded text-sm ${
                            isDisabled
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded border ${
                currentPage === 1
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Previous
            </button>

            <span className="font-medium">Page {currentPage}</span>

            <button
              onClick={handleNext}
              disabled={!hasNextPage}
              className={`px-4 py-2 rounded border ${
                !hasNextPage
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default MyBids
