import { useState } from "react";

import {
  FiAlertCircle,
  FiCalendar,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFileText,
  FiHardDrive,
  FiLoader,
  FiTag,
  FiTrendingDown,
} from "react-icons/fi";
import { getPdfUrl } from "../utils/resumes";
import api from "../services/api";
const BASE_URL = import.meta.env.VITE_API_URL;

// Helpers
function formatBytes(kb) {
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

//  Meta Badge
function MetaBadge({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700">
      <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
        <Icon size={13} className="text-green-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-200 font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

// Main Component
export default function Resume({ resume, loading, error, onDownload }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  //  Download handler
  const handleDownload = async () => {
    if (!resume?.fileUrl || downloading) return;
    setDownloading(true);
    try {
      // Force Cloudinary to serve as attachment, not inline
      const downloadUrl = resume.fileUrl.replace(
        "/upload/",
        "/upload/fl_attachment/",
      );

      const [response] = await Promise.all([
        fetch(downloadUrl),
        api.patch("/resume/download"),
      ]);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = resume.fileName;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadDone(true);
      onDownload?.();
      setTimeout(() => setDownloadDone(false), 3000);
    } catch {
      window.open(resume.fileUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
          <FiLoader size={22} className="text-green-400 animate-spin" />
        </div>
        <p className="text-sm text-gray-500">Loading resume…</p>
      </div>
    );
  }

  //  Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <FiAlertCircle size={22} className="text-red-400" />
        </div>
        <p className="text-sm text-gray-400 text-center max-w-xs">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <FiFileText size={28} className="text-gray-600" />
        </div>
        <div className="text-center">
          <p className="text-gray-300 font-semibold mb-1">No resume uploaded</p>
          <p className="text-sm text-gray-600">
            Upload a PDF resume to display it here.
          </p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="flex flex-col items-center shrink-0 gap-5">
      {/* Header card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-4 p-5 rounded-2xl bg-gray-800 border border-gray-700">
        {/* Action buttons */}
        <div className="w-full flex items-center gap-2 shrink-0">
          <div className="">
            {resume.isActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Active
              </span>
            )}
            <span className="text-[11px] text-gray-500 ml-3">
              v{resume.version}
            </span>
          </div>
          {/* Open in new tab */}
          <a
            href={getPdfUrl(resume.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-gray-200 bg-gray-700/50 hover:bg-gray-700 border border-gray-700 transition-all"
          >
            <FiExternalLink size={13} />
            Open
          </a>

          {/* Download */}
          <a
            href={`${BASE_URL}/resume/download`}
            download={resume?.fileUrl}
            aria-disabled={!resume}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer    bg-green-600 hover:bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/30 aria-disabled:opacity-60 aria-disabled:cursor-not-allowed `}
          >
            <FiDownload size={14} />
            Download
          </a>
        </div>
      </div>

      {/* Meta badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <MetaBadge
          icon={FiHardDrive}
          label="File Size"
          value={formatBytes(resume.fileSize)}
        />
        <MetaBadge icon={FiTag} label="Version" value={`v${resume.version}`} />
        <MetaBadge
          icon={FiTrendingDown}
          label="Downloads"
          value={(resume.downloadCount ?? 0).toLocaleString()}
        />
        <MetaBadge
          icon={FiCalendar}
          label="Updated"
          value={formatDate(resume.updatedAt)}
        />
      </div>

      {/* PDF Viewer */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-700 bg-gray-800">
        {/* Viewer toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <FiEye size={12} />
            <span>Preview</span>
          </div>
          <span className="text-[10px] text-gray-300 truncate max-w-[200px]">
            {resume.fileName}
          </span>
        </div>

        {/* PDF embed */}
        {!pdfError && !error ? (
          <iframe
            loading="lazy"
            src={
              getPdfUrl(resume.fileUrl) + "#toolbar=0&navpanes=0&scrollbar=1"
            }
            title={resume.fileName}
            className="w-full border-0"
            style={{ height: "75vh", minHeight: 480 }}
            onError={() => setPdfError(true)}
          />
        ) : (
          /* Fallback if iframe fails (CORS / CSP) */
          <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <FiFileText size={24} className="text-amber-400" />
            </div>
            <div>
              <p className="text-gray-300 font-semibold mb-1">
                Preview unavailable
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                The PDF can't be previewed inline. Use the buttons above to open
                or download it.
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-all"
              >
                <FiExternalLink size={13} /> Open in New Tab
              </a>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-500 border border-green-500 transition-all cursor-pointer"
              >
                <FiDownload size={13} /> Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
