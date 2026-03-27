import { create } from "zustand";

/** Single dark theme — no light mode toggle. */
export const DARK_THEME = {
  type: "dark" as const,
  color: "#111",
};

interface ThemeStore {
  theme: typeof DARK_THEME;
}

export const useThemeStore = create<ThemeStore>(() => ({
  theme: DARK_THEME,
}));
