import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data.user);
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        password: "",
        newPassword: "",
      });
    } catch{
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const res = await api.put("/auth/profile", formData);
      setProfile(res.data.user);
      setSuccess("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "", newPassword: "" }));

      // ← Add this line to update navbar instantly
      updateUser(res.data.user);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-pink-600 text-xl">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          My Profile
        </h2>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {profile?.name}
              </h3>
              <p className="text-gray-500">{profile?.email}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  profile?.role === "admin"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-pink-100 text-pink-600"
                }`}
              >
                {profile?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === "profile"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === "password"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
