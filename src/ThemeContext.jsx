import React, { createContext, useContext, useEffect, useState } from "react";
import { settingsAPI } from "./api/axios";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [layoutDensity, setLayoutDensity] = useState("comfortable");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          const response = await settingsAPI.getSettings();
          const backendSettings = response.data;

          // Use backend settings if available, otherwise fallback to localStorage
          setTheme(
            backendSettings.theme || localStorage.getItem("theme") || "light"
          );
          setFontSize(
            backendSettings.font_size ||
              parseInt(localStorage.getItem("fontSize")) ||
              16
          );
          setLayoutDensity(
            backendSettings.layout_density ||
              localStorage.getItem("layoutDensity") ||
              "comfortable"
          );
          setReducedMotion(
            backendSettings.reduced_motion ||
              localStorage.getItem("reducedMotion") === "true"
          );
          setHighContrast(
            backendSettings.high_contrast ||
              localStorage.getItem("highContrast") === "true"
          );
          setColorBlindMode(
            backendSettings.color_blind_mode ||
              localStorage.getItem("colorBlindMode") === "true"
          );
          setLanguage(
            backendSettings.language || localStorage.getItem("language") || "en"
          );
        } else {
          // Fallback to localStorage if no token
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error(
          "Failed to load settings from backend, using localStorage:",
          error
        );
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      setTheme(localStorage.getItem("theme") || "light");
      setFontSize(parseInt(localStorage.getItem("fontSize")) || 16);
      setLayoutDensity(localStorage.getItem("layoutDensity") || "comfortable");
      setReducedMotion(localStorage.getItem("reducedMotion") === "true");
      setHighContrast(localStorage.getItem("highContrast") === "true");
      setColorBlindMode(localStorage.getItem("colorBlindMode") === "true");
      setLanguage(localStorage.getItem("language") || "en");
    };

    loadSettings();
  }, []);

  // Apply theme to document whenever settings change
  useEffect(() => {
    const root = document.documentElement;

    // Set theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);

    // Set CSS custom properties
    root.style.setProperty("--font-size", `${fontSize}px`);
    root.setAttribute("data-density", layoutDensity);

    // Apply accessibility settings
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (colorBlindMode) {
      root.classList.add("color-blind");
    } else {
      root.classList.remove("color-blind");
    }

    // Save to localStorage (for offline use)
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize.toString());
    localStorage.setItem("layoutDensity", layoutDensity);
    localStorage.setItem("reducedMotion", reducedMotion.toString());
    localStorage.setItem("highContrast", highContrast.toString());
    localStorage.setItem("colorBlindMode", colorBlindMode.toString());
    localStorage.setItem("language", language);
  }, [
    theme,
    fontSize,
    layoutDensity,
    reducedMotion,
    highContrast,
    colorBlindMode,
    language,
  ]);

  // Function to refresh settings from backend
  const refreshSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      const backendSettings = response.data;

      setTheme(backendSettings.theme);
      setFontSize(backendSettings.font_size);
      setLayoutDensity(backendSettings.layout_density);
      setReducedMotion(backendSettings.reduced_motion);
      setHighContrast(backendSettings.high_contrast);
      setColorBlindMode(backendSettings.color_blind_mode);
      setLanguage(backendSettings.language);
    } catch (error) {
      console.error("Failed to refresh settings from backend:", error);
    }
  };

  const value = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    layoutDensity,
    setLayoutDensity,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    colorBlindMode,
    setColorBlindMode,
    language,
    setLanguage,
    loading,
    refreshSettings, 
  };

  if (loading) {
    return <div>Loading theme settings...</div>;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
