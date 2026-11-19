import { useSharedTranslation } from '@/shared/hooks';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/store';
import { Button } from '@/shared/ui/button';

export function ThemeToggleButton() {
  const t = useSharedTranslation();
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
      aria-label={isDark ? t('appearance.switchToLightTheme') : t('appearance.switchToDarkTheme')}
      title={isDark ? t('appearance.lightTheme') : t('appearance.darkTheme')}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
