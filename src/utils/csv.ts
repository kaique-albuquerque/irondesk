export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

function escapeCell(value: string | number): string {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): void {
  const header = columns.map((column) => escapeCell(column.header)).join(';');
  const body = rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(';'));
  const csv = [`\uFEFF${header}`, ...body].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
