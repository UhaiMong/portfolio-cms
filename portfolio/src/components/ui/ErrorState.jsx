export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-white/30 text-2xl">!</span>
      </div>
      <p className="text-white/40 text-sm mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs tracking-widest uppercase text-white/30 border border-white/10
            px-6 py-3 hover:border-white/30 hover:text-white/60 transition-all duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
