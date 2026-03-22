import React from "react";
// import { useTheme } from "../../contexts/ThemeContext";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeToggle() {
  // const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="text-xl p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {theme === "light" ? <HiMoon /> : <HiSun />}
    </button>
  );
}
