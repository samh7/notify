import React, { useState, useEffect } from "react";
import useMyStore from "../store/store";
import DatePicker from "react-datepicker"; // You'll need to install this package
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function NewNoteModal() {
  const { addNote, updateNote, toggleModal, setAlert, notes, currentNoteId } =
    useMyStore();
  const [noteData, setNoteData] = useState({
    title: "",
    note: "",
    date: new Date().toLocaleDateString(),
    tags: [],
    pin: false,
    timer: null,
  });

  useEffect(() => {
    if (currentNoteId !== null) {
      const currentNote = notes.find((note) => note.id === currentNoteId);
      setNoteData(
        currentNote || {
          title: "",
          note: "",
          date: new Date().toLocaleDateString(),
          tags: [],
          pin: false,
          timer: null,
        }
      );
    }
  }, [currentNoteId, notes]);

  const handleInputChange = (field, value) => {
    setNoteData({ ...noteData, [field]: value });
  };

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setNoteData({
        ...noteData,
        tags: [...noteData.tags, e.target.value.trim()],
      });
      e.target.value = "";
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setNoteData({
      ...noteData,
      tags: noteData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const navigate = useNavigate();
  const handleSave = async () => {
    if (currentNoteId === null) {
      try {
        const response = await axiosInstance.post("/add-note", {
          title: noteData.title,
          content: noteData.note,
          tags: noteData.tags,
          pin: noteData.pin,
          timer: noteData.timer,
        });
        if (response.data && response.data.note) {
          addNote(noteData);

          setAlert({ type: "success", message: "Note saved successfully!" });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          toggleModal();
        }
      } catch (error) {
        // console.log(error);
        setAlert({
          type: "error",
          message: "Failed to save note",
        });
      }
    } else {
      try {
        const response = await axiosInstance.put(
          `/update-note/${currentNoteId}`,
          noteData
        );
        if (response.data && response.data.note) {
          updateNote(currentNoteId, noteData);

          setAlert({ type: "success", message: "Note updated successfully!" });
          toggleModal();
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: "Failed to update note",
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center backdrop-blur-[2px] items-center"
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          {currentNoteId !== null ? "Edit Note" : "Create New Note"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={noteData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          placeholder="Note content"
          value={noteData.note}
          onChange={(e) => handleInputChange("note", e.target.value)}
          className="w-full p-2 mb-4 border rounded h-32"
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Set Timer
          </label>
          <DatePicker
            selected={noteData.timer}
            onChange={(date) => handleInputChange("timer", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={1}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full p-2 border rounded"
          />
        </div>
        <input
          type="text"
          placeholder="Add tags (press Enter to add)"
          onKeyPress={handleTagAdd}
          // onSpace={handleTagAdd}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4 flex flex-wrap">
          {noteData.tags.map((tag, index) => (
            <span
              key={index}
              className="mr-2 mb-2 bg-gray-200 px-2 py-1 rounded flex items-center"
            >
              {tag}
              <button
                onClick={() => handleTagDelete(tag)}
                className="ml-2 text-red-500 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {currentNoteId !== null ? "Update Note" : "Save Note"}
        </button>
      </div>
    </div>
  );
}
