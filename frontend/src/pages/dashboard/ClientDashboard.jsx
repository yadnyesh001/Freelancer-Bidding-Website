import React, { useState } from "react";
import PostProject from "../../components/ClientDashboard/PostProject.jsx";
import MyProjects from "../../components/ClientDashboard/MyProjects";
import Messaging from "../../components/ClientDashboard/Messaging";
import Stats from "../../components/ClientDashboard/Stats";
import Profile from "../../components/ClientDashboard/Profile";
import DashboardHome from "../../components/ClientDashboard/DashboardHome";
import BidsOnMyProjects from "../../components/ClientDashboard/BidsOnMyProjects";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />;
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
        return <DashboardHome />;
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 md:w-64 sm:w-48 bg-white shadow-lg flex-shrink-0 hidden sm:block">
        <div className="p-4 md:p-6 border-b">
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Client Dashboard</h1>
        </div>
        
        <nav className="mt-4 md:mt-6 overflow-y-auto h-[calc(100%-80px)]">
          {[
            { key: "home", label: "Dashboard" },
            { key: "post", label: "Post Project" },
            { key: "projects", label: "My Projects" },
            { key: "bids", label: "Project Bids" },
            { key: "chat", label: "Messages" },
            { key: "stats", label: "Statistics" },
            { key: "profile", label: "Profile" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full text-left px-4 md:px-6 py-2 md:py-3 text-sm md:text-base transition-colors duration-200 ${
                activeTab === item.key
                  ? "bg-blue-600 text-white border-r-4 border-blue-800"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
            { key: "home", label: "Dashboard" },
            { key: "post", label: "Post" },
            { key: "projects", label: "Projects" },
            { key: "bids", label: "Bids" },
            { key: "chat", label: "Chat" },
            { key: "stats", label: "Stats" },
            { key: "profile", label: "Profile" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-2 rounded text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
  );
};

export default ClientDashboard;