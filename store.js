import { create } from "zustand";

const useStore = create((set) => ({
  
  isUploading: false,
  setIsUploading: (value) => set({ isUploading: value }),
  isUploadSuccessfull : false,
  isUploadErrorOccured:false,
  setIsUploadSuccessfull: (value) => set({ isUploadSuccessfull: value }),
  setIsUploadErrorOccured: (value) => set({ isUploadErrorOccured: value }),

}));

export default useStore;