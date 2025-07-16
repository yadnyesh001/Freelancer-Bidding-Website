import React, { useState } from "react";
import PostProject from "../../components/ClientDashboard/PostProject.jsx";
import MyProjects from "../../components/ClientDashboard/MyProjects";
import BidsOnMyProjects from "../../components/ClientDashboard/BidsOnMyProjects";
import Messaging from "../../components/ClientDashboard/Messaging";
import Stats from "../../components/ClientDashboard/Stats";
import Profile from "../../components/ClientDashboard/Profile";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTab = () => {
    switch (activeTab) {
      case "post":
        return <PostProject />;
      case "projects":
        return <MyProjects />;
      case "bids":
        return <BidsOnMyProjects />;
      case "chat":
        return <Messaging />;
      case "stats":
        return <Stats />;
      case "profile":
        return <Profile />;
      default:
        return <h2 className="text-xl p-4">Welcome to Client Dashboard</h2>;
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex gap-4 flex-wrap">
        {[
          { key: "home", label: "Home" },
          { key: "post", label: "Post Project" },
          { key: "projects", label: "My Projects" },
          { key: "bids", label: "Bids Received" },
          { key: "chat", label: "Messaging" },
          { key: "stats", label: "Statistics" },
          { key: "profile", label: "Profile" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`px-4 py-2 rounded ${
              activeTab === item.key ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">{renderTab()}</div>
    </div>
  );
};

export default ClientDashboard;
