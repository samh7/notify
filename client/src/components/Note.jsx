import React, { useState, useEffect } from "react";
import useMyStore from "../store/store";
import { BiSolidPencil, BiSolidTrashAlt, BiPin, BiAlarm } from "react-icons/bi";
import { motion, useTransform, useMotionValue } from "framer-motion";
import axiosInstance from "../utils/axiosInstance";

const Note = React.memo(function Note({
  title,
  note,
  date,
  tags,
  pin,
  id,
  timer,
}) {
  const {
    toggleModal,
    notes,
    setNotes,
    setCurrentNoteId,
    isDragging,
    setEditNote,
    setAlert,
    addTimerAlert,
  } = useMyStore();

  const x = useMotionValue(0);
  const [isClicked, setIsClicked] = useState(false);
  const [isDelClicked, setIsDelClicked] = useState(false);
  const [timerStatus, setTimerStatus] = useState("inactive");

  useEffect(() => {
    let intervalId;
    if (timer) {
      const checkTimer = () => {
        const now = new Date();
        const timerDate = new Date(timer);
        const timeDiff = timerDate - now;

        if (timeDiff <= 0) {
          setTimerStatus("expired");
          addTimerAlert(id, title);
          clearInterval(intervalId);
        } else if (timeDiff <= 30 * 60 * 1000) {
          // 30 minutes
          setTimerStatus("warning");
        } else {
          setTimerStatus("active");
        }
      };

      checkTimer(); // Check immediately
      intervalId = setInterval(checkTimer, 1000); // Check every second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timer, id, title, addTimerAlert]);

  const animateOnClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  const deleteNote = async (e) => {
    if (isDragging) return;
    e.stopPropagation();
    try {
      const response = await axiosInstance.delete(`/delete-note/${id}`);
      if (response.data) {
        animateDelete();
        setAlert({
          type: "success",
          message: "Note deleted successfully",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error.response);

      setAlert({
        type: "error",
        message: error.response?.data?.message || "Failed to delete note",
      });
    }
  };

  const animateDelete = () => {
    setIsDelClicked(true);
    setTimeout(() => {
      setIsDelClicked(false);
    }, 300);
  };

  const deleteThreshold = 100;

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > deleteThreshold) {
      deleteNote(event);
    }
  };

  const pinNote = async (e) => {
    if (isDragging) return;
    animateOnClick();
    e.stopPropagation();
    try {
      const response = await axiosInstance.put(`/update-pin/${id}`);
      if (response.data) {
        setAlert({
          type: "success",
          message: "Note pinned successfully",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error.response);
      setAlert({
        type: "error",
        message: "Failed to pin note",
      });
      return;
    }
  };

  const borderColor = useTransform(x, [-80, 0, 80], ["#ff0000", "", "#ff0000"]);

  const handleNoteClick = (e) => {
    e.stopPropagation();
    if (!isDragging) {
      setCurrentNoteId(id);
      setEditNote(false);
      toggleModal();
    }
  };

  return (
    <div>
      <motion.div
        style={{ x, borderColor }}
        initial={{ y: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{
          y: isClicked ? (pin ? 10 : -10) : 0,
          scale: isDelClicked ? 0.9 : 1,
          opacity: isDelClicked ? 0.6 : 1,
        }}
        transition={{ duration: 0.3 }}
        onClick={handleNoteClick}
        className={`w-[80vw] sm:w-[300px]  border-[1.5px] h-[150px] flex ${
          pin ? "border-blue-300" : "border-gray-300"
        } 
          ${isDelClicked && "border-red-500"}
        p-3 rounded-lg cursor-pointer relative`}
      >
        <div className="h-full w-[5%] sm:w-[10%] left-2">
          {timer && (
            <BiAlarm
              className={`w-5 h-5 ${
                timerStatus === "expired"
                  ? "text-red-500"
                  : timerStatus === "warning"
                  ? "text-orange-500"
                  : "text-blue-500"
              }`}
            />
          )}
        </div>

        <div className="h-full w-[80%] sm:w-[75%] pr-7 pb-5 mt-2 flex flex-col justify-center">
          <h1 className="text-lg font-semibold h-7 overflow-ellipsis line-clamp-1">
            {title}
          </h1>
          <p className="text-gray-400/80 h-5 text-sm overflow-ellipsis line-clamp-1">
            {date}
          </p>
          <p className="text-gray-500 h-[40px] font-semibold text-sm overflow-ellipsis line-clamp-2">
            {note}
          </p>
          <p className="text-gray-500 h-5 text-sm font-semibold overflow-ellipsis line-clamp-1">
            {tags.map((tag) => `#${tag}`).join(" ")}
          </p>
        </div>
        <div className="h-full w-[15%]">
          <div className="w-full flex justify-end items-start h-[90%]">
            <BiPin
              onClick={pinNote}
              className={`${
                pin ? "text-blue-500" : "text-gray-500"
              } w-6 h-6 md:w-5 md:h-5`}
            />
          </div>
          <div className="w-full space-x-3 flex justify-center items-start h-[10%]">
            <BiSolidPencil
              onClick={(e) => {
                e.stopPropagation();
                setCurrentNoteId(id);
                setEditNote(true);
                toggleModal();
              }}
              className="w-5 h-5 text-gray-500"
            />
            <BiSolidTrashAlt
              onClick={deleteNote}
              className="w-5 h-5 text-gray-500"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default Note;
