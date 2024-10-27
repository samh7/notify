import { create } from "zustand";

const useMyStore = create((set, get) => ({
  isModalShown: false,
  toggleModal: () => set((state) => ({ isModalShown: !state.isModalShown })),
  notes: [],
  setNotes: (state) => set(() => ({ notes: state })),
  currentNoteId: null,
  setCurrentNoteId: (id) => set(() => ({ currentNoteId: id })),
  isDragging: false,
  setIsDragging: (truth) => set(() => ({ isDragging: truth })),
  editNote: false,
  setEditNote: (truth) => set(() => ({ editNote: truth })),
  addNote: (newNote) =>
    set((state) => ({
      notes: [{ ...newNote, id: Date.now(), date: new Date().toLocaleDateString() }, ...state.notes].sort((a, b) => b.pin - a.pin),
    })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...updatedNote, id } : note
      ),
    })),
  alert: null,
  setAlert: (alert) => set({ alert }),
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  filteredNotes: () => {
    const { notes, searchTerm } = get();
    if (!searchTerm.trim()) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  },
  timerAlerts: [],
  addTimerAlert: (id, noteTitle) =>
    set((state) => {
      // Only add the alert if it doesn't already exist
      if (!state.timerAlerts.some((alert) => alert.id === id)) {
        return { timerAlerts: [...state.timerAlerts, { id, noteTitle }] };
      }
      return state;
    }),
  removeTimerAlert: (id) =>
    set((state) => ({
      timerAlerts: state.timerAlerts.filter((alert) => alert.id !== id),
    })),
  checkExpiredTimers: () => {
    const { notes, addTimerAlert } = get();
    const now = new Date();
    notes.forEach((note) => {
      if (note.timer && new Date(note.timer) <= now) {
        addTimerAlert(note.id, note.title);
      }
    });
  },

  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
}));

function getNotes() {
  return [].map((id) => getNote(id, false));
}

function getNote(id, pin) {
  return {
    id: id,
    title: `Sign up for a gym membership today ${id}`,
    note: "Go to Planet Fitness and sign up for a membership...",
    date: "6th Apr 2024",
    tags: ["yoga", "fitness"],
    pin: false,
    timer: null, // Add this line
  };
}

export default useMyStore;
