import React from "react";
import useMyStore from "../store/store";

export default function ViewNoteModal() {
  const { toggleModal, notes, currentNoteId } = useMyStore();
  const currentNote = notes.find(note => note.id === currentNoteId);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex justify-center backdrop-blur-[2px] items-center"
      onClick={toggleModal}
    >
      <div 
        className="bg-white p-6 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{currentNote.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{currentNote.date}</p>
        <p className="mb-4 whitespace-pre-wrap h-[150px] overflow-y-auto">{currentNote.note}</p>
        {currentNote.timer && (
          <p className="mb-4 text-sm text-blue-500">
            Timer set for: {new Date(currentNote.timer).toLocaleString()}
          </p>
        )}
        <div className="mb-4 flex flex-wrap">
          {currentNote.tags.map((tag, index) => (
            <span
              key={index}
              className="mr-2 mb-2 bg-gray-200 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
