"use client";

export const defaultSettings = {
  boardBgColor: "#ffffff",
  xColor: "#000000",
  oColor: "#000000",
  borderColor: "#d4d4d4",
  cellSize: 60,
  symbolSize: 28,
};

const STORAGE_KEY = "tic-tac-toe-next-settings";

export function loadSettings() {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignorujemy błąd
  }
}
