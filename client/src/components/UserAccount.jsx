import React, { useState } from "react";
// import useUserStore from '../store/userStore'; // Import your Zustand user store
import axiosInstance from "../utils/axiosInstance";
import Alert from "./Alert";
import useMyStore from "../store/store";
import { useEffect } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
  const { userInfo, setUserInfo } = useMyStore(); // Use the Zustand store

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      // setLoading(true);

      const response = await axiosInstance.get("/get-user");

      if (response.data.user) {
        setUserInfo(response.data.user);
        setUsername(userInfo.username);
        setEmail(userInfo.email);
      }
      // setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setAlert({
        show: true,
        message: "Passwords do not match",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const updatedInfo = { username, email };
      if (newPassword) {
        updatedInfo.password = newPassword;
      }

      const response = await axiosInstance.put("/api/user/update", updatedInfo);
      setUserInfo(response.data); // Update the Zustand store
      setEditMode(false);
      setAlert({
        show: true,
        message: "Profile updated successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || "Error updating profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center ">
          <Spinner color="bg-black" />
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6">User Account</h2>
          {alert.show && <Alert message={alert.message} type={alert.type} />}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editMode}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="bg-white  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
              />
            </div>
            {editMode && (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    className="bg-white  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    className="bg-white border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              {!editMode ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spinner color="bg-white" /> : "Save Changes"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}{" "}
    </>
  );
};

export default UserAccount;
