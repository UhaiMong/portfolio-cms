import { useEffect, useMemo, useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

const NAV_ITEMS = [
  { id: "home", label: "Home", path: "/", group: "Navigate" },
  { id: "work", label: "All Work", path: "/archives", group: "Navigate" },
  { id: "blog", label: "Blog", path: "/blog", group: "Navigate" },
  { id: "about", label: "About", path: "/about", group: "Navigate" },
  { id: "contact", label: "Contact", path: "/contact", group: "Navigate" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const { resume } = useData();

  const actions = useMemo(() => {
    const list = [
      ...NAV_ITEMS,
      {
        id: "theme",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        group: "Actions",
        run: () => toggleTheme(),
      },
    ];
    if (resume?.fileUrl) {
      list.push({
        id: "resume",
        label: "Open resume",
        group: "Actions",
        run: () => window.open(resume.fileUrl, "_blank", "noopener"),
      });
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => item.label.toLowerCase().includes(q));
  }, [query, theme, toggleTheme, resume]);

  useEffect(() => {
    const onKey = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setActive(0);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const run = (item) => {
    if (!item) return;
    setOpen(false);
    if (item.run) item.run();
    else if (item.path) navigate(item.path);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, actions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(actions[active]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close command palette"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="relative w-full max-w-lg rounded-2xl border border-line bg-surface-elevated shadow-2xl overflow-hidden"
          >
            <input
              autoFocus
              value={query}
              onInput={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search pages and actions…"
              className="w-full bg-transparent px-4 py-3.5 text-sm text-ink outline-none border-b border-line"
              aria-label="Command search"
            />
            <ul className="max-h-72 overflow-auto py-2" role="listbox">
              {actions.length === 0 && (
                <li className="px-4 py-3 text-sm text-ink-faint">No matches</li>
              )}
              {actions.map((item, i) => (
                <li key={item.id} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between
                      ${i === active ? "bg-accent-soft text-ink" : "text-ink-muted"}`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] uppercase tracking-widest text-ink-faint">
                      {item.group}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 border-t border-line text-[10px] tracking-wide uppercase text-ink-faint">
              ↑↓ navigate · Enter select · Esc close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
