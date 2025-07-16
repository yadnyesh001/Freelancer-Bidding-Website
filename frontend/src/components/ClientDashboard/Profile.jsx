import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    axios.get("/api/v1/client/profile").then((res) => setProfile(res.data));
  }, []);

  const handleUpdate = () => {
    axios.put("/api/v1/client/profile", profile);
    alert("Profile Updated");
  };

  return (
    <div className="space-y-2">
      <input
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        className="border p-2 w-full rounded"
      />
      <input
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        className="border p-2 w-full rounded"
      />
      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
