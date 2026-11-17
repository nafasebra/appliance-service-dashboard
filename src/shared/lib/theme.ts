import { create } from 'zustand';

type Theme = 'light' | 'dark';
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

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

export const useTheme = create<ThemeState>((set, get) => ({
  theme:
    typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark'
      ? 'dark'
      : 'light',
  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    set({ theme });
  },
}));

applyTheme(useTheme.getState().theme);
