import React from "react";
import useMyStore from "../store/store";
import Note from "./note";
import NewNoteModal from "./NewNoteModal";
import ViewNoteModal from "./ViewNoteModal";
import Alert from "./Alert";
import NoNotesImg from "../assets/noNotes.png";
import { GoPlus } from "react-icons/go";

export default function NotesMain({ filteredNotes }) {
  const { isModalShown, toggleModal, setCurrentNoteId, editNote, setEditNote } =
    useMyStore();

  return (
    <>
      <Alert />
      <div className="flex flex-wrap justify-center gap-5 p-5">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <img src={NoNotesImg} className="w-[200px]" alt="no notes" />
            <div className="text-gray-500 flex flex-col items-center font-semibold">
              <div>No notes found</div>
              {/* <br /> */}
              <div>Click the 'add' button to add a new note.</div>
            </div>
          </div>
        ) : (
          filteredNotes.map((note, idx) => (
            <Note key={idx} id={idx} {...note} timer={note.timer} />
          ))
        )}

        {isModalShown && (
          <div onClick={(e) => e.stopPropagation()}>
            {editNote ? <NewNoteModal /> : <ViewNoteModal />}
          </div>
        )}
      </div>
      <div className="fixed bottom-[40px] right-[40px] w-10 h-10 flex items-center justify-center rounded-md bg-blue-600">
        <GoPlus
          onClick={(e) => {
            e.stopPropagation();
            setEditNote(true);
            setCurrentNoteId(null);
            toggleModal();
          }}
          className="w-6 h-6 text-white"
        />
      </div>
    </>
  );
}
