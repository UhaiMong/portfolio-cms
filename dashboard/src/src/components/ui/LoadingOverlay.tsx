import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface Props {
  title?: string;
}

export default function LoadingOverlay({ title = "Loading..." }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-8 py-6 shadow-2xl">
        <Loader2 size={28} className="animate-spin text-indigo-500" />
        <p className="text-sm text-gray-300 font-medium">{title}</p>
      </div>
    </div>
  );
}
