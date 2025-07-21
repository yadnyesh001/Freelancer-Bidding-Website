import React, { useEffect, useState } from "react";
import axios from "axios";

const BidsOnMyProjects = ({ projectId }) => {
  const [bids, setBids] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBids = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/bid/project/${projectId}?page=${page}&limit=5`);
      setBids(res.data.bids);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Error fetching bids:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchBids(currentPage);
    }
  }, [projectId, currentPage]);

  if (loading) return <p>Loading bids...</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-4">Bids Received</h2>
      {bids.length === 0 ? (
        <p>No bids found.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {bids.map((bid) => (
              <li key={bid._id} className="border p-3 rounded shadow-sm">
                <p><strong>Freelancer:</strong> {bid.freelancer?.name || "N/A"}</p>
                <p><strong>Bid Amount:</strong> ₹{bid.amount}</p>
                <p><strong>Submitted:</strong> {new Date(bid.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BidsOnMyProjects;
