import axiosInstance from "./axiosInstance";
import useMyStore from "../store/store";
// axiosInstance
export const convertNotes = (notes) => {
  const { setNotes, setAlert } = useMyStore();

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

export const fetchAllNotes = async () => {
  const { setNotes, setAlert } = useMyStore();

  try {
    const response = await axiosInstance.get("/get-all-notes");
    if (response.data && response.data.notes) {
      const notes = convertNotes(response.data.notes);
      setNotes(notes);
    }
  } catch (error) {
    setAlert({
      type: "error",
      message: error.response?.data?.message || "Error fetching notes",
    });
  }
};
