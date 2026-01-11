import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("theme", theme);
    // Apply theme class to body
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
