// js/theme.js: Handles theme toggling and persistence

const THEMES = ["light", "dark", "sepia"];
let currentThemeIndex = 0;

export function loadTheme() {
  const savedTheme = localStorage.getItem("storyforgeTheme") || "light";
  applyTheme(savedTheme);
}

export function nextTheme() {
  // Cycle through THEMES
  const current = document.documentElement.classList;
  if(current.contains("dark-theme")) {
    applyTheme("sepia");
  } else if(current.contains("sepia-theme")) {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
}

function applyTheme(themeName) {
  document.documentElement.classList.remove("dark-theme", "sepia-theme");
  if(themeName === "dark") {
    document.documentElement.classList.add("dark-theme");
  } else if(themeName === "sepia") {
    document.documentElement.classList.add("sepia-theme");
  }
  localStorage.setItem("storyforgeTheme", themeName);
}