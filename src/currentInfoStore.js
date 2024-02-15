import { create } from "zustand";

const useUserStore = create((set) => ({
  userCurrentInfo: {},
  changeUserCurrentInfo: (value) =>
    set((state) => {
      console.log(value);
      console.log(state);
      return {
        userCurrentInfo: { ...state.userCurrentInfo, ...value },
      };
    }),
  // changeUserCurrentInfo: (newInfo) => set(() => ({ userCurrentInfo: newInfo })),
}));

export default useUserStore;
