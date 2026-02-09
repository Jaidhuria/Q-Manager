import { create } from 'zustand';

const STORAGE_KEY = 'question-tracker-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === 'dark';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const applyTheme = (isDark) => {
  if (typeof document === 'undefined') return;
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const useThemeStore = create((set) => ({
  isDark: getInitialTheme(),

  toggleTheme: () => {
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      applyTheme(next);
      return { isDark: next };
    });
  },

  initTheme: () => {
    const isDark = getInitialTheme();
    applyTheme(isDark);
    set({ isDark });
  },
}));

export default useThemeStore;
