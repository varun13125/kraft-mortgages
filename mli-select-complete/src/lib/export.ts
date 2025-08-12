export function toCSV(rows: Record<string, any>[], columns?: string[]) {
  if (!rows || rows.length === 0) return "";
  const cols = columns || Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map(escape).join(",");
  const data = rows.map(r => cols.map(c => escape(r[c])).join(",")).join("\n");
  return header + "\n" + data;
}

export function download(filename: string, data: string, mime = "text/plain") {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(filename: string, rows: Record<string, any>[], columns?: string[]) {
  const csv = toCSV(rows, columns);
  download(filename, csv, "text/csv");
}

export function downloadJSON(filename: string, obj: any) {
  download(filename, JSON.stringify(obj, null, 2), "application/json");
}
