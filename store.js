import { create } from "zustand";

const useStore = create((set, get) => ({

  // ── Upload state ──
  isUploading: false,
  setIsUploading: (value) => set({ isUploading: value }),
  isUploadSuccessfull: false,
  isUploadErrorOccured: false,
  setIsUploadSuccessfull: (value) => set({ isUploadSuccessfull: value }),
  setIsUploadErrorOccured: (value) => set({ isUploadErrorOccured: value }),

  // ── Selection mode for image multi-select & delete ──
  selectionMode: false,
  setSelectionMode: (value) => set({ selectionMode: value }),

  // ────────────────────────────────────────────────
  // Image batch cache
  //
  // Stores ALL user images fetched from the batch endpoint.
  // Dashboard paginates locally from this cache.
  // Zero server calls for page changes.
  // ────────────────────────────────────────────────
  imageCache: null,       // { data: [...], total, expiresAt }
  imageCacheTime: null,   // when cache was set (Date.now)

  setImageCache: (cache) =>
    set({
      imageCache: cache,
      imageCacheTime: Date.now(),
    }),

  clearImageCache: () =>
    set({
      imageCache: null,
      imageCacheTime: null,
    }),

  /**
   * Get a page of images from the local cache.
   * No server call — just array slicing.
   * @param {number} page  - 1-indexed
   * @param {number} limit - items per page
   * @returns {{ images: [], total, totalPages }} or null if no cache
   */
  getPage: (page, limit) => {
    const cache = get().imageCache;
    if (!cache?.data) return null;

    const start = (page - 1) * limit;
    const images = cache.data.slice(start, start + limit);

    return {
      images,
      total: cache.total,
      totalPages: Math.ceil(cache.total / limit),
    };
  },

  /**
   * Check if the cache has expired (signed URLs about to expire).
   * Returns true if cache is stale or doesn't exist.
   */
  isCacheExpired: () => {
    const cache = get().imageCache;
    if (!cache?.expiresAt) return true;

    // Refresh 60 seconds before URLs actually expire
    const bufferSeconds = 60;
    const expiresAtMs = cache.expiresAt * 1000;

    return Date.now() >= expiresAtMs - bufferSeconds * 1000;
  },

}));

export default useStore;