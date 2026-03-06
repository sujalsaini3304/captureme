import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Checkbox from "@mui/material/Checkbox";
import { Trash2, X } from "lucide-react";
import useStore from "../../../store";

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  let date = new Date(dateStr);
  const now = new Date();
  if (date > now) date = now;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const GridBox = ({ images, onDelete, selectionMode = false, onExitSelectionMode }) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const { setSelectionMode } = useStore();

  // Clear selection when selection mode is turned off from parent
  useEffect(() => {
    if (!selectionMode) setSelectedIds(new Set());
  }, [selectionMode]);

  if (!Array.isArray(images)) return null;

  const anySelected = selectedIds.size > 0;

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    if (onExitSelectionMode) onExitSelectionMode();
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setIsDeleting(false);
      setSelectionMode(false);
    }
  };

  return (
    <div className="p-4 relative">

      {/* ── IMAGE GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img, i) => {
          const isSelected = selectedIds.has(img._id);

          return (
            <div
              key={img._id || i}
              onClick={() => {
                if (selectionMode || anySelected) {
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (next.has(img._id)) next.delete(img._id);
                    else next.add(img._id);
                    return next;
                  });
                } else {
                  setLightboxIndex(i);
                }
              }}
              className={`cursor-pointer rounded-xl overflow-hidden shadow-md relative group transition-all duration-200 ${isSelected
                ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-[#0f172a]"
                : "hover:shadow-lg"
                }`}
            >
              {/* ── CHECKBOX (top-left) ── */}
              <div
                className={`absolute top-1.5 left-1.5 z-10 transition-opacity duration-150 ${selectionMode ? "opacity-100" : "opacity-0"
                  }`}
                onClick={(e) => {
                  // Only allow checkbox interaction when in selection mode or items are selected
                  if (selectionMode || anySelected) {
                    toggleSelect(img._id, e);
                  }
                }}
              >
                <Checkbox
                  checked={isSelected}
                  slotProps={{ input: { "aria-label": "Select image" } }}
                  sx={{
                    p: 0.25,
                    color: "white",
                    "&.Mui-checked": { color: "#3b82f6" },
                    "& .MuiSvgIcon-root": { fontSize: 28 },
                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
                    borderRadius: "4px",
                  }}
                />
              </div>

              {/* ── SELECTION OVERLAY ── */}
              {isSelected && (
                <div className="absolute inset-0 bg-blue-500/15 z-[1] pointer-events-none rounded-xl" />
              )}

              {/* ── IMAGE ── */}
              <img
                src={img.url}
                className={`w-full h-40 object-cover transition-transform duration-200 ${!anySelected ? "group-hover:scale-105" : ""
                  }`}
                alt="uploaded"
                draggable={false}
              />

              {/* ── DATE & TIME ── */}
              <div className="px-2 py-1.5 bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 text-xs text-center">
                {formatDateTime(img.createdAt || img.uploadedAt || img.date)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LIGHTBOX ── */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={images.map((img) => ({ src: img.url }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />

      {/* ── FLOATING DELETE BAR ── */}
      {anySelected && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white dark:bg-[#1e293b] shadow-2xl rounded-full px-5 py-2.5 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {selectedIds.size} selected
          </span>

          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />

          <button
            onClick={clearSelection}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X size={14} />
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GridBox;