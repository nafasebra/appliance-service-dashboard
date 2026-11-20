import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { translateLabel } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { navigation } from '../config/navigation.ts';
import { useDashboardTranslation } from '../hooks/use-dashboard-translation.tsx';

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')
    .trim();
}

export function DashboardSearch() {
  const t = useDashboardTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const normalizedQuery = normalizeSearch(query);
  const results = navigation
    .map(({ label, ...item }) => ({ ...item, label: translateLabel(label) }))
    .filter(({ label, to }) => normalizeSearch(`${label} ${to}`).includes(normalizedQuery));

  useEffect(() => {
    function onShortcut(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        !(event.ctrlKey || event.metaKey) ||
        event.altKey ||
        event.shiftKey ||
        (event.code !== 'KeyK' && event.key.toLowerCase() !== 'k')
      )
        return;
      if (!open && document.querySelector('[role="dialog"][data-state="open"]')) return;

      event.preventDefault();
      setOpen(true);
      inputRef.current?.focus();
    }

    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, [open]);

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) setQuery('');
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="text-muted-foreground lg:w-auto lg:justify-start lg:px-3"
          aria-label={t('search.title')}
          aria-keyshortcuts="Control+K Meta+K"
        >
          <Search aria-hidden="true" />
          <span className="hidden lg:inline">{t('search.title')}</span>
          <kbd
            dir="ltr"
            aria-hidden="true"
            className="hidden rounded border bg-muted px-1 text-caption lg:inline"
          >
            Ctrl/⌘ K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="top-[12dvh] translate-y-0 gap-0 p-0 max-mobile:top-0 max-mobile:left-0 max-mobile:h-dvh max-mobile:w-screen max-mobile:max-w-none max-mobile:translate-x-0 max-mobile:rounded-none max-mobile:border-0"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key))
            return;
          const links = Array.from(resultsRef.current?.querySelectorAll('a') ?? []);
          const index = links.indexOf(document.activeElement as HTMLAnchorElement);
          const next =
            event.key === 'ArrowDown'
              ? links[index + 1]
              : links[index < 0 ? links.length - 1 : index - 1];
          if (links.length) {
            event.preventDefault();
            (next ?? inputRef.current)?.focus();
          }
        }}
      >
        <DialogTitle className="sr-only">{t('search.title')}</DialogTitle>
        <form
          role="search"
          className="flex items-center gap-2 border-b px-3 py-2 max-mobile:min-h-16 max-mobile:pt-[max(0.5rem,env(safe-area-inset-top))]"
          onSubmit={(event) => {
            event.preventDefault();
            resultsRef.current?.querySelector('a')?.click();
          }}
        >
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('search.title')}
            placeholder={t('search.placeholder')}
            className="border-0 shadow-none"
          />
        </form>
        {results.length ? (
          <ul
            ref={resultsRef}
            className="max-h-[55dvh] overflow-y-auto p-2 max-mobile:max-h-[calc(100dvh-4.5rem)]"
          >
            {results.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => changeOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-body outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="p-4 text-body text-muted-foreground">
            {t('search.empty')}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
