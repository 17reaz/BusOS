import { Badge } from "@/components/ui/badge";

function StatusBadge({ value }: { value: string }) {
  const dark = ["Boarding", "Confirmed", "Active", "Completed", "On route", "Available", "VIP"].includes(value);
  return <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${dark ? "border-foreground/20 bg-foreground text-background" : "bg-muted/50 text-muted-foreground"}`}>{value}</Badge>;
}

export { StatusBadge };
