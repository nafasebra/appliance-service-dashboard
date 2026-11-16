import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/lib/theme';
import { Button } from '@/shared/ui/button';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[6px] border-border bg-background text-primary hover:bg-accent"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'فعال‌کردن پوسته روشن' : 'فعال‌کردن پوسته تاریک'}
      title={isDark ? 'پوسته روشن' : 'پوسته تاریک'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
