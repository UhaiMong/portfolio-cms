// Table of Contents
function TableOfContents({ headings, activeId }) {
  if (!headings.length) return null;

  return (
    <nav className="space-y-1">
      <p className="text-[10px] tracking-widest uppercase mb-3">Contents</p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block text-xs py-1 transition-all duration-300 truncate
            ${h.level === 3 ? "pl-3" : ""}
            ${
              activeId === h.id
                ? "text-black dark:text-gray-200"
                : "text-gray-800 dark:text-gray-300 hover:text-black/60 dark:hover:text-white/60"
            }`}
        >
          {activeId === h.id && (
            <span className="inline-block w-3 h-px bg-black dark:bg-white mr-2 align-middle" />
          )}
          {h.text}
        </a>
      ))}
    </nav>
  );
}
export default TableOfContents;
