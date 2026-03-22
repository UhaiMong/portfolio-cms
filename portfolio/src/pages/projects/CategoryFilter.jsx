//  Category filter pills
function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`text-xs px-3 py-1.5 rounded-full tracking-wide transition-all duration-300
            ${
              active === cat
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
export default CategoryFilter;
