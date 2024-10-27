import create from 'zustand';

const useUserStore = create((set) => ({
  userInfo: {
    username: '',
    email: '',
    // other user properties...
  },
  updateUserInfo: (newInfo) => set((state) => ({ userInfo: { ...state.userInfo, ...newInfo } })),
  // other actions...
}));

export default useUserStore;
