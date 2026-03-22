const base =
  "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium transition-all border cursor-pointer";

const variants = {
  primary:
    base +
    " bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary",
  outline:
    base +
    " border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  ghost:
    base + " border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
};

export default function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={variants[variant]} {...props}>
      {children}
    </button>
  );
}
