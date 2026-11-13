export default function PageLoader({ title = "Loading", subtitle }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-surface text-ink">
      <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-ink/10 rounded-full" />
          <div className="absolute inset-0 border-t-2 border-accent rounded-full animate-spin motion-reduce:animate-none" />
        </div>
        <p className="text-ink-muted text-sm tracking-[0.25em] uppercase">{title}</p>
        {subtitle && <p className="text-ink-faint text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}
