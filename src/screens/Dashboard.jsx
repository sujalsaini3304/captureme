import React, { useEffect, useState } from "react";
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
import { useAuth } from "@clerk/clerk-react";

const Dashboard = () => {
  const { getToken, userId } = useAuth();
  const {
    isUploading,
    isUploadErrorOccured,
    isUploadSuccessfull,
    selectionMode,
    setSelectionMode,
  } = useStore();

  const exitSelectionMode = () => setSelectionMode(false);

  // Images from backend
  const [images, setImages] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = window.innerWidth >= 1024 ? 20 : 10;

  const [open, setOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);


  // ===============================
  // FETCH IMAGES FROM BACKEND
  // ===============================
  const fetchImages = async (currentPage = page) => {
    setIsFetching(true);
    try {
      const token = await getToken({ template: "SnapDock", skipCache: true });

      const res = await axios.get(
        `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/images`,
        {
          params: { page: currentPage, limit, sort: "desc" },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const fetchedImages = res.data?.data || [];
      setImages(fetchedImages);
      setTotalPages(fetchedImages.length > 0 ? res.data?.totalPages || 1 : 1);
    } catch (error) {
      console.error("Fetch images error:", error);
      setImages([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setIsFetching(false);
    }
  };

  // ===============================
  // DELETE SELECTED IMAGES
  // ===============================
  const handleDelete = async (ids) => {
    try {
      const token = await getToken({ template: "SnapDock", skipCache: true });
      await axios.delete(
        `${import.meta.env.VITE_EXPRESS_SERVER_ENDPOINT}/api/images`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          data: { ids },
        }
      );
      // Refresh current page (go to page 1 if all images on this page were deleted)
      fetchImages(page);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ===============================
  // RESET & FETCH WHEN USER CHANGES
  // On userId change: reset to page 1 and fetch fresh.
  // On page change (same user): fetch that page.
  // ===============================
  useEffect(() => {
    if (!userId) return; // wait until auth is ready
    setImages([]);
    setTotalPages(1);
    setPage(1);
    fetchImages(1);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchImages(page);
  }, [page]);

  // ===============================
  // AUTO REFRESH AFTER UPLOAD
  // ===============================
  useEffect(() => {
    if (isUploadSuccessfull) {
      fetchImages(1);
      setPage(1);
    }
  }, [isUploadSuccessfull]);

  // ===============================
  // LOADING BACKDROP (upload)
  // ===============================
  useEffect(() => {
    setOpen(isUploading);
  }, [isUploading]);

  // ===============================
  // LOCK SCROLL WHEN ANY BACKDROP IS OPEN
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-[#0f172a] dark:text-gray-200 transition-colors duration-300">


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

      {/* ================= BACKDROP (upload + fetch) ================= */}

      <Backdrop
        sx={{
          gap: 1,
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" size={20} />
        <span>{isFetching && !open ? "Loading ..." : "Please Wait ..."}</span>
      </Backdrop>

      {/* ================= IMAGE GRID ================= */}

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

        {/* ================= PAGINATION (hidden when no images) ================= */}
        {images.length > 0 && (
          <div className="flex pb-6 mt-auto pt-6 justify-center sm:justify-end sm:mr-2">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;