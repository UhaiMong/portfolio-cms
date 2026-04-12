import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, Image, FileText, Film, File, Check } from "lucide-react";
import { fetchMedia } from "../../src/features/media/mediaSlice";
import type { AppDispatch, RootState } from "../../src/app/store";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

// Types
export interface MediaItem {
  _id: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  folder: string;
  createdAt: string;
}

type SingleProps = {
  multi?: false;
  onSelect: (url: string, item: MediaItem) => void;
  onSelectMultiple?: never;
};

type MultiProps = {
  multi: true;
  onSelect?: never;
  onSelectMultiple: (urls: string[], items: MediaItem[]) => void;
};

type MediaPickerModalProps = {
  open: boolean;
  onClose: () => void;
  allowedTypes?: string[];
} & (SingleProps | MultiProps);

// Helpers
const FILE_TYPES = [
  { label: "All", value: "" },
  { label: "Images", value: "image" },
  { label: "PDFs", value: "pdf" },
  { label: "Videos", value: "video" },
  { label: "Others", value: "other" },
];

const fileIcon = (fileType: string) => {
  if (fileType === "image") return <Image size={14} />;
  if (fileType === "pdf") return <FileText size={14} />;
  if (fileType === "video") return <Film size={14} />;
  return <File size={14} />;
};

const formatSize = (kb: number) =>
  kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

// Component
export default function MediaPickerModal(props: MediaPickerModalProps) {
  const { open, onClose, allowedTypes, multi = false } = props;

  const dispatch = useDispatch<AppDispatch>();
  const { media, loading } = useSelector((s: RootState) => s.media);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Single select
  const [selected, setSelected] = useState<MediaItem | null>(null);
  // Multi select
  const [selectedMany, setSelectedMany] = useState<MediaItem[]>([]);

  // Fetch on open or filter change
  useEffect(() => {
    if (!open) return;
    const params: Record<string, any> = {};
    if (search) params.fileName = search;
    if (typeFilter) params.fileType = typeFilter;
    dispatch(fetchMedia(params));
  }, [open, search, typeFilter, dispatch]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setSearch("");
      setTypeFilter("");
      setSelected(null);
      setSelectedMany([]);
    }
  }, [open]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const visibleItems: MediaItem[] = (media ?? []).filter((item: MediaItem) =>
    allowedTypes?.length ? allowedTypes.includes(item.fileType) : true,
  );

  // Toggle item in multi mode
  const toggleMulti = (item: MediaItem) => {
    setSelectedMany((prev) =>
      prev.find((x) => x._id === item._id)
        ? prev.filter((x) => x._id !== item._id)
        : [...prev, item],
    );
  };

  const handleConfirm = () => {
    if (props.multi) {
      if (selectedMany.length === 0) return;
      props.onSelectMultiple!(
        selectedMany.map((x) => x.fileUrl),
        selectedMany,
      );
    } else {
      if (!selected) return;
      props.onSelect!(selected.fileUrl, selected);
    }
    onClose();
  };

  const isItemSelected = (item: MediaItem) =>
    multi
      ? !!selectedMany.find((x) => x._id === item._id)
      : selected?._id === item._id;

  const selectionCount = multi ? selectedMany.length : selected ? 1 : 0;

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    [],
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-998"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-999 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h2 className="text-white font-semibold text-base tracking-tight">
                    Media Library
                  </h2>
                  {multi && (
                    <p className="text-xs text-white/30 mt-0.5">
                      Click to select multiple images
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 px-5 py-3 border-b border-white/10">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="text"
                    placeholder="Search by file name…"
                    value={search}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10
                      text-white text-sm placeholder:text-white/25
                      focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex gap-1">
                  {FILE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTypeFilter(t.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${
                          typeFilter === t.value
                            ? "bg-indigo-600 text-white"
                            : "text-white/40 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-5">
                {loading ? (
                  <LoadingOverlay title="Media Modal is loading..." />
                ) : visibleItems.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-white/30 text-sm">
                    No files found
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {visibleItems.map((item: MediaItem) => {
                      const isSelected = isItemSelected(item);
                      const isImage = item.fileType === "image";

                      return (
                        <motion.button
                          key={item._id}
                          onClick={() =>
                            multi
                              ? toggleMulti(item)
                              : setSelected(isSelected ? null : item)
                          }
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 text-left
                            ${
                              isSelected
                                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                                : "border-white/10 hover:border-white/30"
                            }`}
                        >
                          {/* Thumbnail */}
                          <div className="aspect-square bg-white/5 flex items-center justify-center">
                            {isImage ? (
                              <img
                                loading="lazy"
                                src={item.fileUrl}
                                alt={item.originalName}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-white/30">
                                {fileIcon(item.fileType)}
                                <span className="text-[10px] uppercase tracking-wider">
                                  {item.fileType}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* File name */}
                          <div className="px-2 py-1.5 bg-black/40">
                            <p className="text-white/70 text-[10px] truncate leading-tight">
                              {item.originalName}
                            </p>
                            <p className="text-white/30 text-[9px] mt-0.5">
                              {formatSize(item.fileSize)}
                            </p>
                          </div>

                          {/* Checkmark */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute top-2 right-2 w-5 h-5 rounded-full
                                  bg-indigo-500 flex items-center justify-center shadow-lg"
                              >
                                <Check size={11} className="text-white" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Multi index badge */}
                          {multi && isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute top-2 left-2 w-5 h-5 rounded-full
                                bg-indigo-600 flex items-center justify-center shadow"
                            >
                              <span className="text-white text-[9px] font-bold">
                                {selectedMany.findIndex(
                                  (x) => x._id === item._id,
                                ) + 1}
                              </span>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-black/20">
                <div className="text-sm text-white/40 truncate max-w-xs">
                  {selectionCount === 0 ? (
                    "No file selected"
                  ) : multi ? (
                    <span className="text-indigo-400 font-medium">
                      {selectionCount} file{selectionCount > 1 ? "s" : ""}{" "}
                      selected
                    </span>
                  ) : (
                    <span className="text-white/70">
                      {selected?.originalName}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm text-white/50
                      hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={selectionCount === 0}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                      bg-indigo-600 text-white hover:bg-indigo-500
                      disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {multi && selectionCount > 0
                      ? `Add ${selectionCount} Image${selectionCount > 1 ? "s" : ""}`
                      : "Select File"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
