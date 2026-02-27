export type CsvValue = string | number | boolean | null | undefined;
export type CsvRow = Record<string, CsvValue>;

function escapeCsvValue(value: CsvValue): string {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value);
  const escaped = raw.replace(/"/g, '""');
  if (/[",\n]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
}

export function toCsv(rows: CsvRow[], columns?: string[]): string {
  if (rows.length === 0) {
    return "";
  }

  const resolvedColumns = columns && columns.length > 0 ? columns : Object.keys(rows[0]);
  const headerLine = resolvedColumns.map((column) => escapeCsvValue(column)).join(",");
  const dataLines = rows.map((row) =>
    resolvedColumns.map((column) => escapeCsvValue(row[column])).join(","),
  );

  return [headerLine, ...dataLines].join("\n");
}

export function downloadCsv(filename: string, rows: CsvRow[], columns?: string[]): void {
  const csv = toCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
