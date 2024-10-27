import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import NotesMain from "./NotesMain";
import TimerAlert from "./TimerAlert";
import useMyStore from "../store/store";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { nav } from "framer-motion/client";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import Alert from "./Alert";

const HomePage = () => {
  const guestUsername = "Guest User";
  let { guest } = useParams();
  const {
    userInfo,
    setUserInfo,
    searchTerm,
    setSearchTerm,
    filteredNotes,
    checkExpiredTimers,
    setAlert,
    setNotes,
  } = useMyStore();

  //   remove this soon!!!!!!!1
  const [loggedIn, setLoggedIn] = React.useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (guest === "guest") {
      localStorage.clear();
    }
    const intervalId = setInterval(() => {
      checkExpiredTimers();
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [checkExpiredTimers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/sign-in");
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");

      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        if (!guest || guest !== "guest") {
          navigate("/sign-in");
        }
      }
    }
  };

  const convertNotes = (notes) => {
    return notes.map((note) => {
      return {
        id: note._id, // Make sure this is correctly set
        title: note.title,
        note: note.content,
        date: note.date,
        tags: note.tags,
        pin: note.pin,
        timer: note.timer,
      };
    });
  };

  const fetchAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        const notes = convertNotes(response.data.notes);
        notes.sort((a, b) => b.pin - a.pin);
        setNotes(notes);
      }
    } catch (error) {
      if (userInfo) {
        setAlert({
          type: "error",
          message: error.response?.data?.message || "Error fetching notes",
        });
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchAllNotes();
    // }
    // console.log("fetching notes");

    return () => {};
  }, []);

  if (!userInfo && guest !== "guest") {
    return (
      <div className="w-full h-screen flex justify-center items-center ">
        <Spinner color="bg-black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Alert />
      <header className="bg-blue-600/70 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Notify</div>

          <div className="flex-grow mx-4 flex justify-center">
            <div className="w-full max-w-[400px]">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-full text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center mr-2">
                <span className="text-indigo-800 font-semibold">
                  {userInfo
                    ? userInfo.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : guestUsername
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                {userInfo ? (
                  <div>
                    {userInfo.username}
                    <br />
                    <button
                      onClick={handleLogout}
                      className="text-xs text-gray-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  guestUsername
                )}
              </div>
            </div>
            {loggedIn && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-auto">
        <NotesMain filteredNotes={filteredNotes()} />
      </main>

      <TimerAlert />
    </div>
  );
};

export default HomePage;
