import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "./status-badge";
import type { Column, RowData } from "@/features/admin/data/demo-data";

const PAGE_SIZE = 8;

function toCsv(rows: RowData[], cols: Column[]) {
  const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [
    cols.map((col) => escape(col.label)).join(","),
    ...rows.map((row) => cols.map((col) => escape(row[col.key] ?? "")).join(",")),
  ].join("\r\n");
}

function DataTable({ rows, cols, search }: { rows: RowData[]; cols: Column[]; search: string }) {
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<RowData | null>(null);

  const statuses = useMemo(() => Array.from(new Set(rows.map((row) => row.status).filter(Boolean))), [rows]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = rows.filter((row) => {
      const matchesSearch = !query || Object.values(row).join(" ").toLowerCase().includes(query);
      const matchesStatus = status === "All" || row.status === status;
      return matchesSearch && matchesStatus;
    });
    if (sort) {
      result.sort((a, b) => {
        const left = (a[sort.key] ?? "").toLocaleLowerCase();
        const right = (b[sort.key] ?? "").toLocaleLowerCase();
        return (left.localeCompare(right, undefined, { numeric: true })) * (sort.direction === "asc" ? 1 : -1);
      });
    }
    return result;
  }, [rows, search, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleRows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const first = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const last = Math.min((currentPage + 1) * PAGE_SIZE, filtered.length);

  const exportCsv = () => {
    if (!filtered.length) {
      toast.info("There are no records to export.");
      return;
    }
    const blob = new Blob(["\uFEFF", toCsv(filtered, cols)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `busos-${cols[0]?.key ?? "records"}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} records.`);
  };

  const toggleSort = (key: string) => {
    setSort((current) => current?.key === key
      ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
      : { key, direction: "asc" });
    setPage(0);
  };

  return <>
    <Card className="gap-0 overflow-hidden rounded-xl border shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="text-xs text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> matching records</div>
        <div className="flex items-center gap-2">
          {statuses.length > 0 && <select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }} className="h-8 rounded-md border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring">
            <option value="All">All statuses</option>
            {statuses.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>}
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={exportCsv}><Download className="size-3.5" /> Export CSV</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow className="bg-muted/30 hover:bg-muted/30">
            {cols.map((col) => <TableHead key={col.key} className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide">
              <button onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1.5 hover:text-foreground">{col.label}<ArrowUpDown className="size-3 opacity-50" /></button>
            </TableHead>)}
            <TableHead className="w-16 text-right text-[10px] uppercase tracking-wide">View</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {visibleRows.map((row, index) => <TableRow key={row.id ?? `${currentPage}-${index}`} className="text-xs">
              {cols.map((col) => <TableCell key={col.key} className={`whitespace-nowrap py-3 ${col.key === "id" ? "font-semibold" : ""} ${col.key === "amount" ? "font-semibold tabular-nums" : ""}`}>
                {col.key === "status" ? <StatusBadge value={row[col.key]} /> : row[col.key] ?? "—"}
              </TableCell>)}
              <TableCell className="text-right"><Button variant="ghost" size="icon" className="size-7" aria-label={`View ${row.id ?? "record"}`} onClick={() => setSelected(row)}><Eye className="size-3.5" /></Button></TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
      {filtered.length === 0 && <div className="py-12 text-center text-xs text-muted-foreground">No records match your search or filters.</div>}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3">
        <p className="text-[11px] text-muted-foreground">Showing {first}–{last} of {filtered.length}</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Page {currentPage + 1} of {pageCount}</span>
          <Button variant="outline" size="icon" className="size-7" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage((value) => Math.max(0, value - 1))}><ChevronLeft className="size-3.5" /></Button>
          <Button variant="outline" size="icon" className="size-7" aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}><ChevronRight className="size-3.5" /></Button>
        </div>
      </div>
    </Card>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Record details</DialogTitle><DialogDescription>Read-only sample record from the Admin demo workspace.</DialogDescription></DialogHeader>
        {selected && <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{cols.map((col) => <div key={col.key} className="rounded-lg border bg-muted/20 p-3"><dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{col.label}</dt><dd className="mt-1 break-words text-sm font-medium">{col.key === "status" ? <StatusBadge value={selected[col.key]} /> : selected[col.key] ?? "—"}</dd></div>)}</dl>}
      </DialogContent>
    </Dialog>
  </>;
}

export { DataTable };
