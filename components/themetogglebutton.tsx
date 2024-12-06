"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    // Add fade class before changing theme to trigger fade-out
    document.documentElement.classList.add("fade");

    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
      const newTheme = !isDarkMode ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");

      // Remove fade-out class and fade in the new theme
      document.documentElement.classList.remove("fade");
    }, 300); // Wait for fade-out to complete before switching themes
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center px-4 py-2 rounded-lg transition-colors duration-500 ease-in-out text-primary-foreground border-2" // Adjusted border and radius
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun
          className="h-6 w-6 text-yellow-400 transition-transform duration-500 ease-in-out glow-sun"
        />
      ) : (
        <Moon
          className="h-6 w-6 text-black-50 transition-transform duration-500 ease-in-out glow-moon text-black"
        />
      )}
      <span className="ml-2 transition-opacity duration-500 ease-in-out text-gray-500">
        {isDarkMode ? 'Light' : 'Dark'} Mode
      </span>
    </button>
  );
}
