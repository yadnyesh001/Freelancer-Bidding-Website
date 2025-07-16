import React, { useEffect, useState } from "react";
import axios from "axios";

const BidsOnMyProjects = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/client/bids").then((res) => setBids(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Bids Received</h2>
      <ul className="space-y-2">
        {bids.map((bid) => (
          <li key={bid._id} className="border p-2 rounded shadow">
            <p>Project: {bid.projectTitle}</p>
            <p>Freelancer: {bid.freelancerName}</p>
            <p>Bid Amount: ₹{bid.amount}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidsOnMyProjects;
