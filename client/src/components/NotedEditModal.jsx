import React, { useState, useEffect } from "react";
import useMyStore from "../store/store";
import { FaCross } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function NotedEditModal({ edit }) {
  const {
    isModalShown,
    editNote,
    setEditNote,
    toggleModal,
    currentNoteId,
    notes,
    updateNote,
  } = useMyStore();
  const [noteData, setNoteData] = useState({
    title: "Title",
    date: "Date",
    note: "Note",
    tags: ["tags"],
  });

  // Sync noteData with the current note
  useEffect(() => {
    if (currentNoteId !== null && notes[currentNoteId]) {
      setNoteData(notes[currentNoteId]);
    }
  }, [currentNoteId, notes]);

  const handleInputChange = (field, value) => {
    setNoteData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleTagDelete = (tagToDelete) => {
    setNoteData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const handleTagAdd = (newTag) => {
    if (
      newTag &&
      newTag.length < 7 &&
      !noteData.tags.includes(newTag) &&
      noteData.tags.length < 4
    ) {
      setNoteData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag],
      }));
    }
  };

  const handleSave = () => {
    updateNote(currentNoteId, noteData);
    toggleModal();
  };

  return (
    <div
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          toggleModal();
        }
      }}
      onClick={() => {
        toggleModal();
        setEditNote(false);
      }}
      className="w-full h-full"
    >
      <div className="fixed scrollbar z-[1] flex justify-center items-center top-0 left-0 w-full h-full backdrop-blur-[1.5px]">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`w-[70%] fixed z-[100] md:w-[500px] border-2  shadow overflow-y-auto h-[430px] text-white/90 flex flex-col items-center p-5
             bg-gray-600 rounded-lg`}
        >
          <div className="w-full">
            {/* Title Field */}
            {editNote ? (
              <input
                type="text"
                value={noteData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-2xl border rounded-sm p-1 font-semibold text-white focus:outline-none bg-transparent mb-5 w-full"
              />
            ) : (
              <h1 className="text-2xl font-semibold mb-5">{noteData.title}</h1>
            )}
            {/* Date Field */}
            {editNote ? (
              <input
                type="text"
                value={noteData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="text-sm border rounded-sm p-1.5 text-white focus:outline-none bg-transparent mb-3 w-full"
              />
            ) : (
              <p className="text-sm mb-3">{noteData.date}</p>
            )}
            {/* Note Content */}
            {editNote ? (
              <textarea
                value={noteData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                className="font-semibold border rounded-sm p-1.5 resize-none text-sm h-[123px] text-white focus:outline-none bg-transparent mb-3 w-full"
              />
            ) : (
              <p className="font-semibold text-sm mb-3">{noteData.note}</p>
            )}
            {/* Tags */}
            <div className="text-sm font-semibold w-full">
              {noteData.tags.map((tag) => (
                <span key={tag} className="inline-flex mb-2 items-center mr-2">
                  #{tag}
                  {editNote && (
                    // <button
                    // >
                    <RxCross2
                      onClick={() => handleTagDelete(tag)}
                      className=" ml-1 text-red-500 bg-white  rounded-sm w-5 h-5"
                    />
                  )}
                </span>
              ))}
              {editNote && (
                <input
                  type="text"
                  placeholder="Add tags (upto 4, each 6 letters max)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTagAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="text-sm border rounded-sm p-1.5 border-white focus:outline-none bg-transparent w-full"
                />
              )}
            </div>
            {/* Save Button */}
            {editNote && (
              <button
                onClick={handleSave}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
