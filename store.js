import { create } from "zustand";

const useStore = create((set) => ({

  isUploading: false,
  setIsUploading: (value) => set({ isUploading: value }),
  isUploadSuccessfull: false,
  isUploadErrorOccured: false,
  setIsUploadSuccessfull: (value) => set({ isUploadSuccessfull: value }),
  setIsUploadErrorOccured: (value) => set({ isUploadErrorOccured: value }),

  // Selection mode for image multi-select & delete
  selectionMode: false,
  setSelectionMode: (value) => set({ selectionMode: value }),

}));

export default useStore;