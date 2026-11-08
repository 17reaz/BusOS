import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Column, RowData } from "@/features/admin/data/demo-data";
import { StatusBadge } from "./status-badge";

function DataTable({ rows, cols, search }: { rows: RowData[]; cols: Column[]; search: string }) {
  const filtered = rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase()));
  return <Card className="gap-0 overflow-hidden rounded-xl border shadow-none">
    <div className="overflow-x-auto"><Table>
      <TableHeader><TableRow className="bg-muted/30 hover:bg-muted/30">{cols.map((col) => <TableHead key={col.key} className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide">{col.label}</TableHead>)}<TableHead className="w-10" /></TableRow></TableHeader>
      <TableBody>{filtered.map((row) => <TableRow key={row.id} className="text-xs">{cols.map((col) => <TableCell key={col.key} className={`whitespace-nowrap py-3 ${col.key === "id" ? "font-semibold" : ""} ${col.key === "amount" ? "font-semibold tabular-nums" : ""}`}>{col.key === "status" ? <StatusBadge value={row[col.key]} /> : row[col.key]}</TableCell>)}<TableCell><Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button></TableCell></TableRow>)}</TableBody>
    </Table></div>
    {filtered.length === 0 && <div className="py-12 text-center text-xs text-muted-foreground">No records match your search.</div>}
    <div className="flex items-center justify-between border-t px-4 py-3"><p className="text-[11px] text-muted-foreground">Showing {filtered.length} of {rows.length} demo records</p><div className="flex gap-1"><Button variant="outline" size="icon" className="size-7" disabled><ChevronLeft className="size-3.5" /></Button><Button variant="outline" size="icon" className="size-7" disabled><ChevronRight className="size-3.5" /></Button></div></div>
  </Card>;
}

export { DataTable };
