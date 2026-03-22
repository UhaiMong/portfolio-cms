import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  Trash2,
  Copy,
  Search,
  Filter,
  Image,
  FileText,
  File,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import type { Media } from "../../src/types";
import {
  deleteMedia,
  fetchMedia,
  uploadMedia,
} from "../../src/features/media/mediaSlice";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

type FileType = "" | "image" | "pdf" | "other";

export default function MediaPage() {
  const dispatch = useAppDispatch();
  const { media, loading } = useAppSelector((s) => s.media);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileType>("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchMedia({}));
  }, [dispatch]);
  const filtered = media.filter((m) => {
    const matchSearch = m.originalName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType = typeFilter ? m.fileType === typeFilter : true;
    return matchSearch && matchType;
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "general");
      const res = await dispatch(uploadMedia(fd));
      if (!uploadMedia.fulfilled.match(res))
        toast.error(`Failed: ${file.name}`);
    }
    toast.success("Upload complete!");
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file from Cloudinary? This cannot be undone."))
      return;
    setDeleting(id);
    const res = await dispatch(deleteMedia(id));
    if (deleteMedia.fulfilled.match(res)) {
      toast.success("File deleted");
      if (selected?._id === id) setSelected(null);
    } else toast.error("Failed to delete");
    setDeleting(null);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success("URL copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const fmtSize = (kb: number) =>
    kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const FileIcon = ({ type }: { type: string }) =>
    type === "image" ? (
      <Image size={20} className="text-indigo-400" />
    ) : type === "pdf" ? (
      <FileText size={20} className="text-rose-400" />
    ) : (
      <File size={20} className="text-gray-400" />
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {media.length} files uploaded
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload size={15} /> Upload Files
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragOver ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 hover:border-indigo-500 hover:bg-gray-900"}`}
      >
        <Upload
          size={24}
          className={`mx-auto mb-2 ${dragOver ? "text-indigo-400" : "text-gray-600"}`}
        />
        <p className="text-sm text-gray-400">
          Drag & drop files here, or{" "}
          <span className="text-indigo-400">click to browse</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Supports: JPG, PNG, WEBP, GIF, PDF
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FileType)}
            className="bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-8 py-2.5 text-sm text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="pdf">PDFs</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-5">
        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <LoadingOverlay title="Media is loading..." />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
              <Image size={40} className="mx-auto mb-3 opacity-30" />
              <p>No files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((m) => (
                <div
                  key={m._id}
                  onClick={() =>
                    setSelected(selected?._id === m._id ? null : m)
                  }
                  className={`group relative bg-gray-900 border rounded-xl overflow-hidden cursor-pointer transition-all
                    ${selected?._id === m._id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-gray-800 hover:border-gray-700"}`}
                >
                  {/* Preview */}
                  <div className="h-28 bg-gray-800 flex items-center justify-center overflow-hidden">
                    {m.fileType === "image" ? (
                      <img
                        src={m.fileUrl}
                        alt={m.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <FileIcon type={m.fileType} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-gray-300 truncate font-medium">
                      {m.originalName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {fmtSize(m.fileSize)}
                    </p>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(m.fileUrl, m._id);
                      }}
                      className="p-1 bg-gray-900/80 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                    >
                      {copied === m._id ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m._id);
                      }}
                      disabled={deleting === m._id}
                      className="p-1 bg-gray-900/80 rounded hover:bg-red-900/80 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      {deleting === m._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-64 shrink-0 bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4 self-start sticky top-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">File Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Preview */}
            <div className="rounded-lg overflow-hidden bg-gray-800 h-36 flex items-center justify-center">
              {selected.fileType === "image" ? (
                <img
                  src={selected.fileUrl}
                  alt={selected.originalName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <FileIcon type={selected.fileType} />
              )}
            </div>

            {/* Meta */}
            <div className="space-y-2 text-xs">
              {[
                { label: "Name", value: selected.originalName },
                { label: "Type", value: selected.mimeType },
                { label: "Size", value: fmtSize(selected.fileSize) },
                { label: "Uploaded", value: fmtDate(selected.createdAt) },
                { label: "Used in", value: selected.usedIn || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-gray-500 shrink-0">{label}</span>
                  <span className="text-gray-300 truncate text-right">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* URL copy */}
            <div>
              <p className="text-xs text-gray-500 mb-1.5">File URL</p>
              <div className="flex gap-1.5">
                <input
                  readOnly
                  value={selected.fileUrl}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none truncate"
                />
                <button
                  onClick={() => copyUrl(selected.fileUrl, selected._id)}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shrink-0"
                >
                  {copied === selected._id ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <a
                href={selected.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg transition-colors"
              >
                Open
              </a>
              <button
                onClick={() => handleDelete(selected._id)}
                disabled={deleting === selected._id}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors"
              >
                {deleting === selected._id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
