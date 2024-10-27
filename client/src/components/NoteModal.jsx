import React, { useState } from "react";
import useMyStore from "../store/store";

export default function NoteModal({ edit }) {
  const {
    isModalShown,
    toggleModal,
    currentNoteId,
    notes,
    setCurrentNoteId,
    updateNote,
  } = useMyStore();
  const [noteData, setNoteData] = useState(notes[currentNoteId]);

  const handleInputChange = (field, value) => {
    setNoteData({ ...noteData, [field]: value });
  };

  const handleTagDelete = (tagToDelete) => {
    setNoteData({
      ...noteData,
      tags: noteData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleTagAdd = (newTag) => {
    if (newTag && !noteData.tags.includes(newTag)) {
      setNoteData({
        ...noteData,
        tags: [...noteData.tags, newTag],
      });
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
      onClick={() => toggleModal()}
      className="w-full h-full"
    >
      <div className="fixed scrollbar z-[1] flex justify-center items-center top-0 left-0 w-full h-full backdrop-blur-[1.5px]">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[70%] fixed z-[100] md:w-[500px] border-2 border-gray-400 shadow overflow-y-auto h-[400px] text-white/90 flex flex-col items-center p-5 bg-gray-500 rounded-lg"
        >
          <div className="w-full">
            {edit ? (
              <input
                type="text"
                value={noteData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-2xl font-semibold text-black focus:outline-none bg-transparent mb-5 w-full"
              />
            ) : (
              <h1 className="text-2xl font-semibold mb-5">{noteData.title}</h1>
            )}
            {edit ? (
              <input
                type="text"
                value={noteData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="text-sm text-black focus:outline-none bg-transparent mb-3 w-full"
              />
            ) : (
              <p className="text-sm mb-3">{noteData.date}</p>
            )}
            {edit ? (
              <textarea
                value={noteData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                className="font-semibold text-sm text-black focus:outline-none bg-transparent mb-3 w-full"
              />
            ) : (
              <p className="font-semibold text-sm mb-3">{noteData.note}</p>
            )}
            <div className="text-sm font-semibold w-full">
              {noteData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center mr-2">
                  #{tag}
                  {edit && (
                    <button
                      onClick={() => handleTagDelete(tag)}
                      className="ml-1 text-red-500"
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
              {edit && (
                <input
                  type="text"
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTagAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="text-sm  text-black focus:outline-none bg-transparent w-full"
                />
              )}
            </div>
            {edit && (
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
