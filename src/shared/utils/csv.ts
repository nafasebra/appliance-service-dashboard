export function escapeCsvCell(value: string): string {
  const safeValue = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function downloadCsv(rows: string[][], filename: string): void {
  const url = URL.createObjectURL(
    new Blob(['\uFEFF' + rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')], {
      type: 'text/csv;charset=utf-8;',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
