import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/store/theme-store';
import { Button } from '@/shared/ui/button';

export function ThemeToggleButton() {
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="grid h-7.75 w-7.75 shrink-0 place-items-center rounded-md border-border bg-background text-primary hover:bg-accent"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'فعال‌کردن پوسته روشن' : 'فعال‌کردن پوسته تاریک'}
      title={isDark ? 'پوسته روشن' : 'پوسته تاریک'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
