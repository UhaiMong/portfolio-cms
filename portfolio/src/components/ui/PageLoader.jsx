import { useEffect } from "react";

export default function PageLoader({ title = "Loading", subtitle }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-white/30 text-sm tracking-[0.3em] uppercase animate-pulse">
            {title}
          </p>
          {subtitle && (
            <p className="text-white/20 text-xs tracking-wide">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
