export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center dark:bg-gray-900 dark:text-gray-200 bg-gray-200 text-gray-900">
      <div className="w-16 h-16 border border-red-600 text-red-600 rounded-full flex items-center justify-center mb-6">
        <span className="text-2xl">!</span>
      </div>
      <p className="text-sm mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs tracking-widest uppercase border dark:border-white/10 border-gray-800 cursor-pointer
            px-6 py-3 bg-green-600 text-gray-950 transition-all duration-300"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
