const persianCollator = new Intl.Collator('fa', { numeric: true, sensitivity: 'base' });

export function compareTableValues(left: unknown, right: unknown): number {
  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return persianCollator.compare(String(left), String(right));
}
