import React, { useEffect, useState } from "react";
import axios from "axios";

const Stats = () => {
  const [stats, setStats] = useState({ projects: 0, bids: 0 });

  useEffect(() => {
    axios.get("/api/v1/client/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-bold mb-2">Dashboard Stats</h2>
      <p>Total Projects Posted: {stats.projects}</p>
      <p>Total Bids Received: {stats.bids}</p>
    </div>
  );
};

export default Stats;
