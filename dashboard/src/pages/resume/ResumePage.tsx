import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  Trash2,
  CheckCircle,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import Badge from "../../src/components/ui/Badge";
import {
  activateResume,
  deleteResume,
  fetchResumes,
  uploadResume,
} from "../../src/features/resume/resumeSlice";
import LoadingOverlay from "../../src/components/ui/LoadingOverlay";

export default function ResumePage() {
  const dispatch = useAppDispatch();
  const { resumes, active, loading } = useAppSelector((s) => s.resume);

  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState("1.0");
  const [file, setFile] = useState<File | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("resume", file);
    fd.append("version", version);
    fd.append("isActive", "false");
    const res = await dispatch(uploadResume(fd));
    if (uploadResume.fulfilled.match(res)) {
      toast.success("Resume uploaded!");
      setFile(null);
    } else toast.error("Upload failed");
    setUploading(false);
  };

  const handleActivate = async (id: string) => {
    setActing(id);
    const res = await dispatch(activateResume(id));
    if (activateResume.fulfilled.match(res)) toast.success("Resume activated!");
    else toast.error("Failed to activate");
    setActing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    setActing(id);
    const res = await dispatch(deleteResume(id));
    if (deleteResume.fulfilled.match(res)) toast.success("Deleted");
    else toast.error("Failed to delete");
    setActing(null);
  };

  const fmtSize = (kb: number) =>
    kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Resume</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Upload and manage your resume PDF
        </p>
      </div>

      {/* Active resume */}
      {active && (
        <div className="bg-indigo-900/20 border border-indigo-700/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">
              Currently Active Resume
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-800/50 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-medium">{active.fileName}</p>
                <p className="text-xs text-gray-400">
                  v{active.version} · {fmtSize(active.fileSize)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Download size={14} /> {active.downloadCount} downloads
              </span>
              <a
                href={active.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                View PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Upload new */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-white">Upload New Resume</h2>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors text-center
            ${file ? "border-indigo-500 bg-indigo-900/10" : "border-gray-700 hover:border-indigo-500"}`}
        >
          <FileText
            size={32}
            className={`mx-auto mb-3 ${file ? "text-indigo-400" : "text-gray-600"}`}
          />
          {file ? (
            <>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">
                {fmtSize(Math.round(file.size / 1024))}
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400">Click to select PDF file</p>
              <p className="text-xs text-gray-600 mt-1">
                Only PDF files are accepted
              </p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />

        {/* Version & upload button */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1.5">
              Version
            </label>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 2.0"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={15} /> Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* All resumes */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">All Versions</h2>
        </div>
        {loading ? (
          <LoadingOverlay title="Resume loading..." />
        ) : resumes.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No resumes uploaded yet
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {resumes.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${r.isActive ? "bg-indigo-800/50" : "bg-gray-800"}`}
                  >
                    <FileText
                      size={16}
                      className={
                        r.isActive ? "text-indigo-400" : "text-gray-500"
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {r.fileName}
                      </p>
                      {r.isActive && <Badge label="Active" variant="green" />}
                    </div>
                    <p className="text-xs text-gray-500">
                      v{r.version} · {fmtSize(r.fileSize)} ·{" "}
                      {fmtDate(r.createdAt)} · {r.downloadCount} downloads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-indigo-400 transition-colors"
                  >
                    <Download size={15} />
                  </a>
                  {!r.isActive && (
                    <button
                      onClick={() => handleActivate(r._id)}
                      disabled={acting === r._id}
                      className="px-2.5 py-1 bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60 rounded text-xs font-medium transition-colors"
                    >
                      {acting === r._id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        "Set Active"
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={acting === r._id || r.isActive}
                    className="p-1.5 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={
                      r.isActive ? "Cannot delete active resume" : "Delete"
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
