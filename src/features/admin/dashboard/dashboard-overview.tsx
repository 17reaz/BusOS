import { ArrowUpRight, Bus, ChevronRight, Clock3, Gauge, Ticket, Users, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metric } from "@/features/admin/components/metric-card";
import { DataTable } from "@/features/admin/components/data-table";
import { columns, salesBars, trips } from "@/features/admin/data/demo-data";

function DashboardOverview({ period, setPeriod, search, onNavigate }: { period: string; setPeriod: (value: string) => void; search: string; onNavigate: (page: string) => void }) {
  const periodBars: Record<string, number[]> = {
    Today: salesBars,
    Week: [42, 58, 66, 51, 74, 83, 68],
    Month: [36, 48, 42, 62, 56, 72, 65, 81, 74, 90, 78, 96],
  };
  const periodLabels: Record<string, string[]> = {
    Today: ["06 AM", "09 AM", "12 PM", "03 PM", "06 PM", "09 PM"],
    Week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Month: ["01", "05", "10", "15", "20", "25", "30"],
  };
  const periodRevenue: Record<string, { total: string; change: string }> = {
    Today: { total: "৳ 2,84,500", change: "+12.8%" },
    Week: { total: "৳ 18,42,000", change: "+9.4%" },
    Month: { total: "৳ 74,28,500", change: "+15.2%" },
  };
  const chartBars = periodBars[period] ?? periodBars.Today;
  const chartLabels = periodLabels[period] ?? periodLabels.Today;
  const revenue = periodRevenue[period] ?? periodRevenue.Today;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Total ticket sales" value="৳ 2,84,500" note="vs. yesterday" icon={Ticket} change="+12.8%" />
        <Metric title="Tickets booked" value="1,248" note="Across all channels" icon={Users} change="+8.2%" />
        <Metric title="Active trips" value="36" note="4 currently boarding" icon={Bus} />
        <Metric title="Available seats" value="482" note="62% of today's capacity" icon={Gauge} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <Card className="gap-4 rounded-xl border shadow-none"><CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 pb-0"><div><CardTitle className="text-sm font-semibold">Revenue overview</CardTitle><CardDescription className="mt-1 text-xs">Ticket revenue performance over time</CardDescription></div><div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">{["Today", "Week", "Month"].map((p) => <Button key={p} size="sm" variant={period === p ? "secondary" : "ghost"} className={`h-7 px-2.5 text-[10px] ${period === p ? "bg-background shadow-sm" : ""}`} onClick={() => setPeriod(p)}>{p}</Button>)}</div></CardHeader>
          <CardContent className="px-5 pb-5"><div className="mb-4 flex items-end gap-3"><p className="text-2xl font-semibold tracking-tight">{revenue.total}</p><span className="mb-1 flex items-center gap-1 text-[11px] font-medium"><ArrowUpRight className="size-3.5" />{revenue.change}</span></div><div className="relative h-[190px] w-full"><div className="absolute inset-0 flex flex-col justify-between">{["৳ 3L", "৳ 2L", "৳ 1L", "৳ 0"].map((label) => <div key={label} className="flex items-center gap-3"><span className="w-8 text-[10px] text-muted-foreground">{label}</span><div className="h-px flex-1 border-t border-dashed" /></div>)}</div><div className="absolute bottom-0 left-11 right-0 top-1 flex items-end gap-[5px]">{chartBars.map((height, i) => <div key={i} className="group flex h-full flex-1 items-end"><div className={`w-full rounded-t-[3px] transition-opacity hover:opacity-60 ${i === 13 ? "bg-primary" : "bg-foreground/15"}`} style={{ height: `${height}%` }} title={`৳ ${height * 1000}`} /></div>)}</div></div><div className="ml-11 mt-2 flex justify-between text-[10px] text-muted-foreground">{chartLabels.map((label) => <span key={label}>{label}</span>)}</div></CardContent></Card>
        <Card className="gap-4 rounded-xl border shadow-none"><CardHeader className="px-5 pb-0"><CardTitle className="text-sm font-semibold">Booking channels</CardTitle><CardDescription className="text-xs">Today's booking distribution</CardDescription></CardHeader><CardContent className="px-5 pb-5"><div className="flex justify-center py-3"><div className="relative flex size-[156px] items-center justify-center rounded-full" style={{ background: "conic-gradient(#171717 0deg 216deg, #777 216deg 288deg, #c9c9c9 288deg 342deg, #e8e8e8 342deg 360deg)" }}><div className="flex size-[112px] flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-semibold">1,248</span><span className="text-[10px] text-muted-foreground">Bookings</span></div></div></div><div className="space-y-3 pt-2">{[{ name: "Counter sales", amount: "749", value: "60%", color: "bg-[#171717]" }, { name: "Online booking", amount: "250", value: "20%", color: "bg-[#777]" }, { name: "Mobile app", amount: "187", value: "15%", color: "bg-[#c9c9c9]" }, { name: "Agent sales", amount: "62", value: "5%", color: "bg-[#e8e8e8]" }].map((x) => <div key={x.name} className="flex items-center gap-2.5"><span className={`size-2.5 rounded-[3px] ${x.color}`} /><span className="flex-1 text-xs text-muted-foreground">{x.name}</span><span className="text-xs font-medium">{x.amount}</span><span className="w-9 text-right text-[11px] text-muted-foreground">{x.value}</span></div>)}</div></CardContent></Card>
      </div>
      <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Upcoming departures</h2><p className="mt-1 text-xs text-muted-foreground">Monitor today's trips and boarding status</p></div><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onNavigate("Trips & schedules")}>All trips <ChevronRight className="ml-1 size-3.5" /></Button></div>
      <DataTable rows={trips.slice(0, 4)} cols={columns["Trips & schedules"]} search={search} />
      <div className="grid gap-3 md:grid-cols-3"><Metric title="On-time departures" value="89%" note="32 of 36 trips on schedule" icon={Clock3} /><Metric title="Fleet availability" value="92%" note="42 buses ready for dispatch" icon={Bus} /><Metric title="System status" value="Healthy" note="All services operational" icon={Wifi} /></div>
    </>
  );
}

export { DashboardOverview };
