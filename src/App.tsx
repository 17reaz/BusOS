import { useState } from "react";
import { columns, dataset, finance, fleet, initialBookings, navigation, operations, pageConfig, passengers, routes, salesBars, trips } from "@/features/admin/data/demo-data";
import { LiveTrackingMap } from "@/features/admin/components/live-tracking-map";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { Metric } from "@/features/admin/components/metric-card";
import { DataTable } from "@/features/admin/components/data-table";
import {
  Activity, ArrowUpRight, Bus, CalendarDays, CalendarClock,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign,
  Clock3, Command, CreditCard, Download, Filter, Gauge,
  LifeBuoy,MapPinned, Menu, MoreHorizontal, Navigation, Plus,
  Search, SlidersHorizontal, Ticket, Users, Wallet, Wifi, X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


function App() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState("Today");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdLabel, setCreatedLabel] = useState("");
  const [createdName, setCreatedName] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [notice, setNotice] = useState("");

  const currentConfig = pageConfig[active];
  const currentRows = active === "Ticket sales" ? bookings : dataset[active] ?? [];
  // const filteredCount = useMemo(() => currentRows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())).length, [currentRows, search]);

  const openCreate = () => {
    if (active === "Live tracking") {
      setNotice("Location feed refreshed · 4 coaches reporting");
      return;
    }
    setCreatedLabel(currentConfig?.action ?? "New booking");
    setCreatedName("");
    setDialogOpen(true);
  };

  const submitCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (active === "Ticket sales" || active === "Overview") {
      const id = `BK-${80422 + bookings.length - initialBookings.length}`;
      setBookings((items) => [{ id, passenger: createdName || "Demo passenger", route: "Dhaka → Chattogram", seat: "E1", trip: "TR-2048", date: "07 Nov, 02:00 PM", amount: "৳ 1,200", status: "Confirmed", channel: "Counter" }, ...items]);
      setActive("Ticket sales");
      setNotice("Demo booking created successfully");
    } else {
      setNotice(`${createdLabel} demo action completed · sample data only`);
    }
    setDialogOpen(false);
    setSearch("");
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-[72px] items-center gap-3 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bus className="size-5" strokeWidth={2.3} /></div>
        <div className="min-w-0"><p className="text-[15px] font-bold tracking-tight">BusOS</p><p className="text-[11px] text-muted-foreground">BUSINESS OPERATIONS</p></div>
        <Button variant="ghost" size="icon" className="ml-auto size-8 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-4" /></Button>
      </div>
      <div className="px-4 pb-4"><button className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left hover:bg-muted"><div className="flex size-8 items-center justify-center rounded-md bg-muted"><Command className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Dhaka Express Ltd.</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><ChevronDown className="size-4 text-muted-foreground" /></button></div>
      <div className="px-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
        <nav className="space-y-1">{navigation.map((item) => { const Icon = item.icon; const selected = active === item.label; return <button key={item.label} onClick={() => { setActive(item.label); setSearch(""); setMobileOpen(false); }} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-[17px]" /><span className="flex-1 text-left">{item.label}</span>{item.count && <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${selected ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted"}`}>{item.count}</span>}</button>; })}</nav>
        <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Management</p>
        <nav className="space-y-1">{operations.map((item) => { const Icon = item.icon; const selected = active === item.label; return <button key={item.label} onClick={() => { setActive(item.label); setSearch(""); setMobileOpen(false); }} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-[17px]" /><span className="flex-1 text-left">{item.label}</span></button>; })}</nav>
      </div>
      <div className="mt-auto p-3"><div className="rounded-xl border bg-muted/40 p-3"><div className="mb-2 flex items-center gap-2"><LifeBuoy className="size-4" /><span className="text-xs font-semibold">Need a hand?</span></div><p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">Visit the help center for setup guides and support.</p><Button variant="outline" size="sm" className="h-8 w-full bg-background text-xs">Help center <ChevronRight className="ml-auto size-3.5" /></Button></div><div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2"><Avatar className="size-8"><AvatarFallback className="bg-muted text-[11px] font-semibold">RA</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Reaz Ahmed</p><p className="text-[11px] text-muted-foreground">Owner account</p></div><MoreHorizontal className="size-4 text-muted-foreground" /></div></div>
    </>
  );

  const Dashboard = () => (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Total ticket sales" value="৳ 2,84,500" note="vs. yesterday" icon={Ticket} change="+12.8%" />
        <Metric title="Tickets booked" value="1,248" note="Across all channels" icon={Users} change="+8.2%" />
        <Metric title="Active trips" value="36" note="4 currently boarding" icon={Bus} />
        <Metric title="Available seats" value="482" note="62% of today's capacity" icon={Gauge} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <Card className="gap-4 rounded-xl border shadow-none"><CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 pb-0"><div><CardTitle className="text-sm font-semibold">Revenue overview</CardTitle><CardDescription className="mt-1 text-xs">Ticket revenue performance over time</CardDescription></div><div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">{["Today", "Week", "Month"].map((p) => <Button key={p} size="sm" variant={period === p ? "secondary" : "ghost"} className={`h-7 px-2.5 text-[10px] ${period === p ? "bg-background shadow-sm" : ""}`} onClick={() => setPeriod(p)}>{p}</Button>)}</div></CardHeader>
          <CardContent className="px-5 pb-5"><div className="mb-4 flex items-end gap-3"><p className="text-2xl font-semibold tracking-tight">৳ 2,84,500</p><span className="mb-1 flex items-center gap-1 text-[11px] font-medium"><ArrowUpRight className="size-3.5" />12.8%</span></div><div className="relative h-[190px] w-full"><div className="absolute inset-0 flex flex-col justify-between">{["৳ 3L", "৳ 2L", "৳ 1L", "৳ 0"].map((label) => <div key={label} className="flex items-center gap-3"><span className="w-8 text-[10px] text-muted-foreground">{label}</span><div className="h-px flex-1 border-t border-dashed" /></div>)}</div><div className="absolute bottom-0 left-11 right-0 top-1 flex items-end gap-[5px]">{salesBars.map((height, i) => <div key={i} className="group flex h-full flex-1 items-end"><div className={`w-full rounded-t-[3px] transition-opacity hover:opacity-60 ${i === 13 ? "bg-primary" : "bg-foreground/15"}`} style={{ height: `${height}%` }} title={`৳ ${height * 1000}`} /></div>)}</div></div><div className="ml-11 mt-2 flex justify-between text-[10px] text-muted-foreground"><span>06 AM</span><span>09 AM</span><span>12 PM</span><span>03 PM</span><span>06 PM</span><span>09 PM</span></div></CardContent></Card>
        <Card className="gap-4 rounded-xl border shadow-none"><CardHeader className="px-5 pb-0"><CardTitle className="text-sm font-semibold">Booking channels</CardTitle><CardDescription className="text-xs">Today's booking distribution</CardDescription></CardHeader><CardContent className="px-5 pb-5"><div className="flex justify-center py-3"><div className="relative flex size-[156px] items-center justify-center rounded-full" style={{ background: "conic-gradient(#171717 0deg 216deg, #777 216deg 288deg, #c9c9c9 288deg 342deg, #e8e8e8 342deg 360deg)" }}><div className="flex size-[112px] flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-semibold">1,248</span><span className="text-[10px] text-muted-foreground">Bookings</span></div></div></div><div className="space-y-3 pt-2">{[{ name: "Counter sales", amount: "749", value: "60%", color: "bg-[#171717]" }, { name: "Online booking", amount: "250", value: "20%", color: "bg-[#777]" }, { name: "Mobile app", amount: "187", value: "15%", color: "bg-[#c9c9c9]" }, { name: "Agent sales", amount: "62", value: "5%", color: "bg-[#e8e8e8]" }].map((x) => <div key={x.name} className="flex items-center gap-2.5"><span className={`size-2.5 rounded-[3px] ${x.color}`} /><span className="flex-1 text-xs text-muted-foreground">{x.name}</span><span className="text-xs font-medium">{x.amount}</span><span className="w-9 text-right text-[11px] text-muted-foreground">{x.value}</span></div>)}</div></CardContent></Card>
      </div>
      <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold">Upcoming departures</h2><p className="mt-1 text-xs text-muted-foreground">Monitor today's trips and boarding status</p></div><Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setActive("Trips & schedules")}>All trips <ChevronRight className="ml-1 size-3.5" /></Button></div>
      <DataTable rows={trips.slice(0, 4)} cols={columns["Trips & schedules"]} search={search} />
      <div className="grid gap-3 md:grid-cols-3"><Metric title="On-time departures" value="89%" note="32 of 36 trips on schedule" icon={Clock3} /><Metric title="Fleet availability" value="92%" note="42 buses ready for dispatch" icon={Bus} /><Metric title="System status" value="Healthy" note="All services operational" icon={Wifi} /></div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col border-r bg-background lg:flex"><SidebarContent /></aside>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-[280px] flex-col border-r bg-background shadow-xl" onClick={(event) => event.stopPropagation()}><SidebarContent /></aside></div>}
      <div className="lg:pl-[252px]">
        <header className="fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center border-b bg-background/95 px-4 backdrop-blur lg:left-[252px] lg:px-8">
          <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></Button>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Workspace</span><ChevronRight className="size-3.5" /><span className="font-medium text-foreground">{active}</span></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="relative hidden w-[220px] md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this page..." className="h-9 border-0 bg-muted/70 pl-9 text-xs shadow-none focus-visible:ring-1" /></div><Button variant="outline" size="sm" className="hidden h-9 gap-2 text-xs sm:flex"><CalendarDays className="size-3.5" /> Nov 07, 2026</Button><Button variant="ghost" size="icon" className="relative size-9" aria-label="Notifications"><Activity className="size-[18px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-foreground ring-2 ring-background" /></Button><Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" /><Avatar className="size-8"><AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">RA</AvatarFallback></Avatar></div>
        </header>
        <main className="min-h-screen px-4 pb-8 pt-[100px] sm:px-6 lg:px-8"><div className="mx-auto max-w-[1440px] space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2"><Badge variant="outline" className="rounded-md bg-background text-[10px] font-medium tracking-wide">SATURDAY, NOVEMBER 07</Badge><span className="size-1 rounded-full bg-muted-foreground" /><span className="text-[11px] text-muted-foreground">Demo workspace</span></div><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{active === "Overview" ? "Good afternoon, Reaz" : currentConfig?.title}</h1><p className="mt-1 text-sm text-muted-foreground">{active === "Overview" ? "Here's what's happening across your transport business today." : currentConfig?.description}</p></div><div className="flex items-center gap-2"><Button variant="outline" className="h-9 gap-2 bg-background text-xs" onClick={() => setNotice("Demo report prepared · no file downloaded")}><Download className="size-3.5" /> Export</Button><Button className="h-9 gap-2 text-xs" onClick={openCreate}><Plus className="size-4" />{currentConfig?.action ?? "New booking"}</Button></div></div>
          {notice && <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs"><span>{notice}</span><Button variant="ghost" size="icon" className="size-6" onClick={() => setNotice("")}><X className="size-3.5" /></Button></div>}
          {active === "Overview" ? <Dashboard /> : <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {active === "Ticket sales" && <><Metric title="Today's sales" value="৳ 2,84,500" note="Gross ticket revenue" icon={CircleDollarSign} change="+12.8%" /><Metric title="Tickets sold" value={String(bookings.length + 1_243)} note="Across all sales channels" icon={Ticket} change="+8.2%" /><Metric title="Confirmed" value="1,186" note="95% confirmation rate" icon={CheckCircle2} /><Metric title="Pending payment" value="৳ 18,400" note="23 bookings awaiting payment" icon={Wallet} /></>}
              {active === "Trips & schedules" && <><Metric title="Scheduled today" value="36" note="Across 12 active routes" icon={CalendarClock} /><Metric title="Boarding now" value="4" note="Next departure in 18 minutes" icon={Users} /><Metric title="Completed" value="12" note="Today's completed trips" icon={CheckCircle2} /><Metric title="Delayed" value="2" note="Requires operations attention" icon={Clock3} /></>}
              {active === "Routes" && <><Metric title="Active routes" value="18" note="Across Bangladesh" icon={MapPinned} /><Metric title="Daily departures" value="126" note="Scheduled services" icon={CalendarDays} /><Metric title="Average distance" value="218 km" note="Per active route" icon={Navigation} /><Metric title="Average fare" value="৳ 1,040" note="All route classes" icon={Wallet} /></>}
              {active === "Passengers" && <><Metric title="Total passengers" value="18,420" note="Registered customer profiles" icon={Users} change="+6.4%" /><Metric title="New this month" value="482" note="New passenger registrations" icon={Plus} /><Metric title="Repeat passengers" value="64%" note="Booked more than once" icon={CheckCircle2} /><Metric title="Passenger feedback" value="4.8 / 5" note="Average service rating" icon={Activity} /></>}
              {active === "Fleet" && <><Metric title="Total vehicles" value="48" note="Registered in fleet" icon={Bus} /><Metric title="Available" value="42" note="Ready for dispatch" icon={CheckCircle2} /><Metric title="On trip" value="36" note="Currently operating" icon={Navigation} /><Metric title="Maintenance" value="3" note="Scheduled service" icon={Gauge} /></>}
              {active === "Finance" && <><Metric title="Total revenue" value="৳ 8.42L" note="Today's ticket sales" icon={CircleDollarSign} change="+12.8%" /><Metric title="Operating expenses" value="৳ 1.24L" note="Fuel, tolls and workshop" icon={Wallet} /><Metric title="Net operating" value="৳ 7.18L" note="Before settlements" icon={ArrowUpRight} /><Metric title="Pending settlements" value="৳ 42,500" note="Agent and counter balance" icon={CreditCard} /></>}
              {active === "Live tracking" && <><Metric title="Active GPS devices" value="36 / 36" note="All active trips reporting" icon={Wifi} /><Metric title="Moving vehicles" value="32" note="4 stopped at terminals" icon={Bus} /><Metric title="Average speed" value="61 km/h" note="Across active vehicles" icon={Gauge} /><Metric title="Delayed trips" value="2" note="Estimated delay above 15 min" icon={Clock3} /></>}
            </div>
            {active === "Live tracking" && <LiveTrackingMap />}
            {active === "Finance" && <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-xl border shadow-none"><CardHeader><CardTitle className="text-sm">Revenue vs expenses</CardTitle><CardDescription className="text-xs">Daily financial performance</CardDescription></CardHeader><CardContent className="space-y-4">{[{ label: "Ticket revenue", amount: "৳ 8,42,000", width: "88%" }, { label: "Operating expenses", amount: "৳ 1,24,000", width: "24%" }, { label: "Agent settlements", amount: "৳ 42,500", width: "12%" }].map((x) => <div key={x.label}><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">{x.label}</span><span className="font-medium">{x.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: x.width }} /></div></div>)}</CardContent></Card><Card className="rounded-xl border shadow-none"><CardHeader><CardTitle className="text-sm">Payment methods</CardTitle><CardDescription className="text-xs">Collected ticket revenue</CardDescription></CardHeader><CardContent className="space-y-3">{[{ name: "Cash / counter", amount: "৳ 4,80,000", percent: "57%" }, { name: "Mobile financial services", amount: "৳ 2,10,000", percent: "25%" }, { name: "Online card", amount: "৳ 1,52,000", percent: "18%" }].map((x) => <div key={x.name} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"><div><p className="text-xs font-medium">{x.name}</p><p className="mt-1 text-[11px] text-muted-foreground">{x.amount}</p></div><Badge variant="outline" className="text-[10px]">{x.percent}</Badge></div>)}</CardContent></Card></div>}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold">{active === "Live tracking" ? "Active vehicle feed" : `All ${active.toLowerCase()}`}</h2><p className="mt-1 text-xs text-muted-foreground">Search, review and manage sample records</p></div><div className="flex items-center gap-2"><Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Filter className="size-3.5" /> Filters</Button><Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><SlidersHorizontal className="size-3.5" /> Columns</Button></div></div>
            <DataTable rows={currentRows} cols={columns[active]} search={search} />
          </>}
          <p className="pb-2 text-center text-[10px] text-muted-foreground">BusOS Admin · Interactive demo · All figures and records are sample data</p>
        </div></main>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{createdLabel}</DialogTitle><DialogDescription>This demo form simulates the selected action. No real records are saved.</DialogDescription></DialogHeader><form onSubmit={submitCreate} className="space-y-3"><div><label className="mb-1.5 block text-xs font-medium">Passenger name</label><Input value={createdName} onChange={(event) => setCreatedName(event.target.value)} placeholder="Enter passenger name" required /></div><div><label className="mb-1.5 block text-xs font-medium">Route</label><Input value="Dhaka → Chattogram" readOnly /></div><div><label className="mb-1.5 block text-xs font-medium">Departure</label><Input value="07 Nov 2026 · 02:00 PM" readOnly /></div><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">Create demo booking</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  );
}

export default App;
