import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Custom type roles are font sizes, not text colors, when merging shadcn classes.
const mergeClasses = extendTailwindMerge({
  extend: {
    theme: { text: ['caption', 'body', 'section', 'page-title', 'metric', 'editable'] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return mergeClasses(clsx(inputs));
}
