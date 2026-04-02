import { useState } from "preact/hooks";
import { FiCheck, FiShare2 } from "react-icons/fi";

// Share button
function ShareButton() {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };
  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-violet-400/60 hover:text-violet-500 transition-all"
    >
      {copied ? (
        <FiCheck size={14} className="text-green-500" />
      ) : (
        <FiShare2 size={14} />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
export default ShareButton;
