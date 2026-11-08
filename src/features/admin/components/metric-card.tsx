import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Metric({ title, value, note, icon: Icon, change }: { title: string; value: string; note: string; icon: React.ElementType; change?: string }) {
  return <Card className="gap-3 rounded-xl border bg-card py-4 shadow-none"><CardContent className="px-4 sm:px-5">
    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{title}</p><div className="flex size-8 items-center justify-center rounded-lg border bg-muted/50"><Icon className="size-4 text-muted-foreground" /></div></div>
    <div className="flex items-end justify-between gap-2"><p className="text-[25px] font-semibold tracking-tight tabular-nums">{value}</p>{change && <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold"><ArrowUpRight className="size-3" />{change}</span>}</div>
    <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
  </CardContent></Card>;
}

export { Metric };
