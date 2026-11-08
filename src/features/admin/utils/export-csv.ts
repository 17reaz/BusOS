import { toast } from "sonner";
import type { Column, RowData } from "@/features/admin/data/demo-data";

export function downloadCsv(rows: RowData[], cols: Column[], filenamePrefix = "busos-export") {
  if (!rows.length || !cols.length) {
    toast.info("There are no records to export.");
    return;
  }
  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    cols.map((col) => escape(col.label)).join(","),
    ...rows.map((row) => cols.map((col) => escape(row[col.key] ?? "")).join(",")),
  ].join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filenamePrefix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${rows.length} records.`);
}
