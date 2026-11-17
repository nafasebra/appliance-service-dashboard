import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export interface ThemeState {
  theme: Theme;
}

export interface ThemeActions {
  toggleTheme: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#111916' : '#f8fafc');
  try {
    localStorage.setItem('hamyar-service-theme', theme);
  } catch {
    /* The theme still works for the current session. */
  }
}

export const useTheme = create<ThemeStore>()(
  subscribeWithSelector((set, get) => ({
    theme:
      typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
        ? 'dark'
        : 'light',
    toggleTheme: () => {
      const theme = get().theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      set({ theme });
    },
  })),
);

applyTheme(useTheme.getState().theme);
