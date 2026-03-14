import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import GridBox from "../components/created_ui/GridBox";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Search } from "lucide-react";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import useStore from "../../store";
import { auth } from "../../firebase.config.js";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const {
    isUploading,
    isUploadErrorOccured,
    isUploadSuccessfull,
    selectionMode,
    setSelectionMode,
    // ── Image cache from Zustand ──
    imageCache,
    setImageCache,
    clearImageCache,
    getPage,
    isCacheExpired,
  } = useStore();

  const exitSelectionMode = () => setSelectionMode(false);

  // Firebase user
  const [user, setUser] = useState(null);

  // Pagination (now local — no server calls)
  const [page, setPage] = useState(1);
  const limit = window.innerWidth >= 1024 ? 20 : 10;

  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);

  // Auto-refresh timer ref
  const refreshTimerRef = useRef(null);

  // ===============================
  // AUTH LISTENER
  // ===============================
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/", { replace: true });
      } else {
        setUser(currentUser);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();

  }, [navigate]);


  // ===============================
  // FETCH BATCH (single API call for ALL images)
  // ===============================
  const fetchBatch = useCallback(async () => {

    if (!user) return;

    setIsFetching(true);

    try {
      const token = await getIdToken(user);

      const res = await axios.get(
        `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/images/batch`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data?.success) {
        setImageCache({
          data: res.data.data || [],
          total: res.data.total || 0,
          expiresAt: res.data.expiresAt || null,
        });
      }

    } catch (error) {
      console.error("Fetch batch error:", error);
      clearImageCache();
    } finally {
      setIsFetching(false);
    }
  }, [user, setImageCache, clearImageCache]);


  // ===============================
  // AUTO-REFRESH BEFORE URL EXPIRY
  //
  // Sets a timer to re-fetch the batch
  // 60 seconds before signed URLs expire.
  // ===============================
  useEffect(() => {
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    if (!imageCache?.expiresAt) return;

    const bufferMs = 60 * 1000; // refresh 60s before expiry
    const expiresAtMs = imageCache.expiresAt * 1000;
    const msUntilRefresh = expiresAtMs - bufferMs - Date.now();

    if (msUntilRefresh > 0) {
      refreshTimerRef.current = setTimeout(() => {
        fetchBatch();
      }, msUntilRefresh);
    }

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [imageCache?.expiresAt, fetchBatch]);


  // ===============================
  // INITIAL FETCH — when user is ready
  // ===============================
  useEffect(() => {
    if (!user) return;

    // If no cache or cache expired, fetch fresh batch
    if (!imageCache || isCacheExpired()) {
      setPage(1);
      fetchBatch();
    }
  }, [user]);


  // ===============================
  // AUTO REFRESH AFTER UPLOAD
  // ===============================
  useEffect(() => {
    if (isUploadSuccessfull) {
      clearImageCache();
      setPage(1);
      fetchBatch();
    }
  }, [isUploadSuccessfull]);


  // ===============================
  // DELETE IMAGES
  // ===============================
  const handleDelete = async (ids) => {

    if (!user) return;

    try {
      const token = await getIdToken(user);

      await axios.delete(
        `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/images`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          data: { ids },
        }
      );

      // Clear cache and re-fetch
      clearImageCache();
      fetchBatch();

    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  // ===============================
  // GET CURRENT PAGE FROM LOCAL CACHE
  // (no server call — instant!)
  // ===============================
  const currentPage = getPage(page, limit);
  const images = currentPage?.images || [];
  const totalPages = currentPage?.totalPages || 1;


  // ===============================
  // UPLOAD LOADER
  // ===============================
  useEffect(() => {
    setOpen(isUploading);
  }, [isUploading]);


  // ===============================
  // LOCK SCROLL
  // ===============================
  const isBackdropOpen = open || isFetching;

  useEffect(() => {
    if (isBackdropOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [isBackdropOpen]);

  if (authLoading) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-[#0f172a] dark:text-gray-200 transition-colors duration-300">

      {/* SUCCESS ALERT */}

      {isUploadSuccessfull && !isUploadErrorOccured && (
        <div className="mt-2 flex justify-center sm:justify-end mx-4">
          <Alert severity="success" className="max-w-md w-full">
            <AlertTitle>Uploaded successfully</AlertTitle>
            <AlertDescription>
              Image(s) uploaded successfully.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* ERROR ALERT */}

      {isUploadErrorOccured && (
        <div className="mt-2 flex justify-center sm:justify-end mx-4">
          <Alert severity="error" className="max-w-md w-full">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>
              Image(s) upload failed, please try again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* BACKDROP */}

      <Backdrop
        sx={{
          gap: 1,
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" size={20} />
        <span>Please wait...</span>
      </Backdrop>

      {/* IMAGE GRID */}

      <div className="flex flex-col flex-1">

        {Array.isArray(images) && images.length > 0 ? (
          <GridBox
            images={images}
            onDelete={handleDelete}
            selectionMode={selectionMode}
            onExitSelectionMode={exitSelectionMode}
          />
        ) : (
          <div className="flex flex-col gap-2 flex-1 items-center justify-center text-center text-gray-400 dark:text-gray-500">
            <Search size={42} />
            Nothing here
          </div>
        )}

        {/* PAGINATION — now instant! No server calls. */}

        {images.length > 0 && totalPages > 1 && (
          <div className="flex pb-6 mt-auto pt-6 justify-center sm:justify-end sm:mr-2">

            <Stack spacing={2}>

              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                shape="rounded"
                sx={{
                  ".MuiPaginationItem-root": {
                    color: "#1f2937",
                    borderColor: "#d1d5db",
                    fontWeight: 500,
                  },
                  ".MuiPaginationItem-root:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                  ".MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                    fontWeight: 600,
                    borderColor: "#3b82f6",
                  },
                  ".MuiPaginationItem-root.Mui-selected:hover": {
                    backgroundColor: "#2563eb",
                  },
                  ".dark &, [data-theme='dark'] &": {
                    ".MuiPaginationItem-root": {
                      color: "#e2e8f0",
                      borderColor: "#475569",
                    },
                    ".MuiPaginationItem-ellipsis": {
                      color: "#cbd5e1",
                    },
                    ".MuiPaginationItem-root:hover": {
                      backgroundColor: "rgba(226, 232, 240, 0.12)",
                    },
                    ".MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#60a5fa",
                      color: "#ffffff",
                    },
                    ".MuiPaginationItem-root.Mui-selected:hover": {
                      backgroundColor: "#3b82f6",
                    },
                  },
                }}
              />

            </Stack>

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;