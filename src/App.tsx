import { useState } from "react";
import { columns, dataset, initialBookings, navigation, operations, pageConfig, salesBars, trips, type RowData } from "@/features/admin/data/demo-data";
import { LiveTrackingMap } from "@/features/admin/components/live-tracking-map";
import { StatusBadge } from "@/features/admin/components/status-badge";
import { Metric } from "@/features/admin/components/metric-card";
import { DataTable } from "@/features/admin/components/data-table";
import { DashboardOverview } from "@/features/admin/dashboard/dashboard-overview";
import { AdminSidebar } from "@/features/admin/layout/admin-sidebar";
import { downloadCsv } from "@/features/admin/utils/export-csv";
import {
  Activity, ArrowUpRight, Building2, Bus, CalendarDays, CalendarClock, FileBarChart,
  CheckCircle2, ChevronDown, ChevronRight, CircleDollarSign,
  Clock3, Command, CreditCard, Download, Filter, Gauge,
  LifeBuoy, MapPinned, Menu, MoreHorizontal, Navigation, Package, Plus,
  Search, ShieldCheck, Ticket, UserRoundCog, Users, Wallet, Wifi, Wrench, X,
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
  const [moduleRecords, setModuleRecords] = useState(dataset);
  const [notice, setNotice] = useState("");

  const currentConfig = pageConfig[active];
  const isBookingForm = active === "Ticket sales" || active === "Overview";
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const todayBadge = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "2-digit" }).format(now).toUpperCase();
  const todayLabel = new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric" }).format(now);
  const currentRows = active === "Ticket sales" ? bookings : moduleRecords[active] ?? [];
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
      const suffix = String(Date.now()).slice(-6);
      const created: Record<string, RowData> = {
        "Trips & schedules": { id: `TR-${suffix}`, route: createdName, departure: "To be scheduled", coach: "Unassigned", seats: "0 / 40", driver: "Unassigned", status: "Scheduled" },
        Routes: { id: `RT-${suffix}`, from: createdName, to: "Set destination", distance: "—", duration: "—", fare: "To be configured", trips: "0 daily", status: "Review" },
        Passengers: { id: `PS-${suffix}`, name: createdName, phone: "Not provided", bookings: "0", spent: "৳ 0", lastTrip: "Never", status: "New" },
        Fleet: { id: `VEH-${suffix}`, coach: createdName, type: "Not configured", seats: "0", driver: "Unassigned", mileage: "0 km", status: "Available" },
        Finance: { id: `TXN-${suffix}`, detail: createdName, category: "Review required", date: todayLabel, method: "Not recorded", amount: "৳ 0", status: "Pending" },
        "Crew & staff": { id: `STF-${suffix}`, name: createdName, role: "Staff member", phone: "Not provided", license: "Pending verification", assigned: "Unassigned", status: "Active" },
        Maintenance: { id: `WO-${suffix}`, vehicle: "Unassigned vehicle", service: createdName, due: "To be scheduled", workshop: "Unassigned", cost: "৳ 0", status: "Open" },
        Inventory: { id: `INV-${suffix}`, item: createdName, category: "General", stock: "0", unit: "Pieces", reorder: "—", status: "New" },
        Counters: { id: `CTR-${suffix}`, name: createdName, branch: "Unassigned", manager: "Unassigned", phone: "Not provided", sales: "৳ 0", status: "Active" },
        "Users & roles": { id: `USR-${suffix}`, name: createdName, email: "Invitation pending", role: "Staff", lastActive: "Never", status: "Invited" },
      };
      const record = created[active];
      if (record) {
        setModuleRecords((current) => ({ ...current, [active]: [record, ...(current[active] ?? [])] }));
        setNotice(`${createdLabel} added to the local demo workspace. It is not saved to a server.`);
      }
    }
    setDialogOpen(false);
    setSearch("");
  };



  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col border-r bg-background lg:flex"><AdminSidebar active={active} onNavigate={(page) => { setActive(page); setSearch(""); setMobileOpen(false); }} onClose={() => setMobileOpen(false)} /></aside>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-[280px] flex-col border-r bg-background shadow-xl" onClick={(event) => event.stopPropagation()}><SidebarContent /></aside></div>}
      <div className="lg:pl-[252px]">
        <header className="fixed left-0 right-0 top-0 z-30 flex h-[72px] items-center border-b bg-background/95 px-4 backdrop-blur lg:left-[252px] lg:px-8">
          <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></Button>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span>Workspace</span><ChevronRight className="size-3.5" /><span className="font-medium text-foreground">{active}</span></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="relative hidden w-[220px] md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this page..." className="h-9 border-0 bg-muted/70 pl-9 text-xs shadow-none focus-visible:ring-1" /></div><Button variant="outline" size="sm" className="hidden h-9 gap-2 text-xs sm:flex"><CalendarDays className="size-3.5" /> {todayLabel}</Button><Button variant="ghost" size="icon" className="relative size-9" aria-label="Notifications"><Activity className="size-[18px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-foreground ring-2 ring-background" /></Button><Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" /><Avatar className="size-8"><AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">RA</AvatarFallback></Avatar></div>
        </header>
        <main className="min-h-screen px-4 pb-8 pt-[100px] sm:px-6 lg:px-8"><div className="mx-auto max-w-[1440px] space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2"><Badge variant="outline" className="rounded-md bg-background text-[10px] font-medium tracking-wide">{todayBadge}</Badge><span className="size-1 rounded-full bg-muted-foreground" /><span className="text-[11px] text-muted-foreground">Demo workspace</span></div><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{active === "Overview" ? "{greeting}, Reaz" : currentConfig?.title}</h1><p className="mt-1 text-sm text-muted-foreground">{active === "Overview" ? "Here's what's happening across your transport business today." : currentConfig?.description}</p></div><div className="flex items-center gap-2"><Button variant="outline" className="h-9 gap-2 bg-background text-xs" onClick={() => downloadCsv(active === "Overview" ? trips : currentRows, columns[active === "Overview" ? "Trips & schedules" : active] ?? [], active === "Overview" ? "upcoming-departures" : active)}><Download className="size-3.5" /> Export CSV</Button><Button className="h-9 gap-2 text-xs" onClick={openCreate}><Plus className="size-4" />{currentConfig?.action ?? "New booking"}</Button></div></div>
          {notice && <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs"><span>{notice}</span><Button variant="ghost" size="icon" className="size-6" onClick={() => setNotice("")}><X className="size-3.5" /></Button></div>}
          {active === "Overview" ? <DashboardOverview period={period} setPeriod={setPeriod} search={search} onNavigate={setActive} /> : <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {active === "Ticket sales" && <><Metric title="Today's sales" value="৳ 2,84,500" note="Gross ticket revenue" icon={CircleDollarSign} change="+12.8%" /><Metric title="Tickets sold" value={String(bookings.length + 1_243)} note="Across all sales channels" icon={Ticket} change="+8.2%" /><Metric title="Confirmed" value="1,186" note="95% confirmation rate" icon={CheckCircle2} /><Metric title="Pending payment" value="৳ 18,400" note="23 bookings awaiting payment" icon={Wallet} /></>}
              {active === "Trips & schedules" && <><Metric title="Scheduled today" value="36" note="Across 12 active routes" icon={CalendarClock} /><Metric title="Boarding now" value="4" note="Next departure in 18 minutes" icon={Users} /><Metric title="Completed" value="12" note="Today's completed trips" icon={CheckCircle2} /><Metric title="Delayed" value="2" note="Requires operations attention" icon={Clock3} /></>}
              {active === "Routes" && <><Metric title="Active routes" value="18" note="Across Bangladesh" icon={MapPinned} /><Metric title="Daily departures" value="126" note="Scheduled services" icon={CalendarDays} /><Metric title="Average distance" value="218 km" note="Per active route" icon={Navigation} /><Metric title="Average fare" value="৳ 1,040" note="All route classes" icon={Wallet} /></>}
              {active === "Passengers" && <><Metric title="Total passengers" value="18,420" note="Registered customer profiles" icon={Users} change="+6.4%" /><Metric title="New this month" value="482" note="New passenger registrations" icon={Plus} /><Metric title="Repeat passengers" value="64%" note="Booked more than once" icon={CheckCircle2} /><Metric title="Passenger feedback" value="4.8 / 5" note="Average service rating" icon={Activity} /></>}
              {active === "Fleet" && <><Metric title="Total vehicles" value="48" note="Registered in fleet" icon={Bus} /><Metric title="Available" value="42" note="Ready for dispatch" icon={CheckCircle2} /><Metric title="On trip" value="36" note="Currently operating" icon={Navigation} /><Metric title="Maintenance" value="3" note="Scheduled service" icon={Gauge} /></>}
              {active === "Crew & staff" && <><Metric title="Registered crew" value={String(currentRows.length)} note="Sample staff records" icon={UserRoundCog} /><Metric title="Active assignments" value="3" note="Crew assigned to trips" icon={Bus} /><Metric title="License reviews" value="1" note="Requires verification" icon={CheckCircle2} /><Metric title="Unassigned crew" value="1" note="Available for scheduling" icon={Users} /></>}
              {active === "Maintenance" && <><Metric title="Open work orders" value="2" note="Scheduled and in progress" icon={Wrench} /><Metric title="Completed this week" value="1" note="Sample maintenance log" icon={CheckCircle2} /><Metric title="Estimated cost" value="৳ 44,500" note="Current sample work orders" icon={Wallet} /><Metric title="Vehicles in service" value="3" note="Fleet sample data" icon={Bus} /></>}
              {active === "Inventory" && <><Metric title="Stock items" value={String(currentRows.length)} note="Tracked sample SKUs" icon={Package} /><Metric title="Low stock alerts" value="1" note="Reorder threshold reached" icon={Activity} /><Metric title="Categories" value="2" note="Parts and lubricants" icon={Building2} /><Metric title="Stock valuation" value="৳ 1.28L" note="Illustrative only" icon={Wallet} /></>}
              {active === "Counters" && <><Metric title="Active counters" value="2" note="Across sample branches" icon={Building2} /><Metric title="Branch locations" value="2" note="Dhaka and Chattogram" icon={MapPinned} /><Metric title="Today's counter sales" value="৳ 1.95L" note="Illustrative sample data" icon={Wallet} /><Metric title="Needs review" value="1" note="Counter profile review" icon={CheckCircle2} /></>}
              {active === "Users & roles" && <><Metric title="Workspace users" value={String(currentRows.length)} note="Sample user accounts" icon={Users} /><Metric title="Active accounts" value="2" note="Can access workspace" icon={CheckCircle2} /><Metric title="Pending invites" value="1" note="Invitation not accepted" icon={UserRoundCog} /><Metric title="Role groups" value="3" note="Owner, manager and agent" icon={ShieldCheck} /></>}
              {active === "Reports" && <><Metric title="Available reports" value={String(currentRows.length)} note="Sample report catalogue" icon={FileBarChart} /><Metric title="Ready to export" value={String(currentRows.length)} note="CSV export available" icon={Download} /><Metric title="Report categories" value="3" note="Revenue, operations, fleet" icon={Activity} /><Metric title="Last generated" value="Today" note="Sample workspace" icon={CalendarDays} /></>}
              {active === "Finance" && <><Metric title="Total revenue" value="৳ 8.42L" note="Today's ticket sales" icon={CircleDollarSign} change="+12.8%" /><Metric title="Operating expenses" value="৳ 1.24L" note="Fuel, tolls and workshop" icon={Wallet} /><Metric title="Net operating" value="৳ 7.18L" note="Before settlements" icon={ArrowUpRight} /><Metric title="Pending settlements" value="৳ 42,500" note="Agent and counter balance" icon={CreditCard} /></>}
              {active === "Live tracking" && <><Metric title="Active GPS devices" value="36 / 36" note="All active trips reporting" icon={Wifi} /><Metric title="Moving vehicles" value="32" note="4 stopped at terminals" icon={Bus} /><Metric title="Average speed" value="61 km/h" note="Across active vehicles" icon={Gauge} /><Metric title="Delayed trips" value="2" note="Estimated delay above 15 min" icon={Clock3} /></>}
            </div>
            {active === "Live tracking" && <LiveTrackingMap />}
            {active === "Finance" && <div className="grid gap-4 lg:grid-cols-2"><Card className="rounded-xl border shadow-none"><CardHeader><CardTitle className="text-sm">Revenue vs expenses</CardTitle><CardDescription className="text-xs">Daily financial performance</CardDescription></CardHeader><CardContent className="space-y-4">{[{ label: "Ticket revenue", amount: "৳ 8,42,000", width: "88%" }, { label: "Operating expenses", amount: "৳ 1,24,000", width: "24%" }, { label: "Agent settlements", amount: "৳ 42,500", width: "12%" }].map((x) => <div key={x.label}><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">{x.label}</span><span className="font-medium">{x.amount}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: x.width }} /></div></div>)}</CardContent></Card><Card className="rounded-xl border shadow-none"><CardHeader><CardTitle className="text-sm">Payment methods</CardTitle><CardDescription className="text-xs">Collected ticket revenue</CardDescription></CardHeader><CardContent className="space-y-3">{[{ name: "Cash / counter", amount: "৳ 4,80,000", percent: "57%" }, { name: "Mobile financial services", amount: "৳ 2,10,000", percent: "25%" }, { name: "Online card", amount: "৳ 1,52,000", percent: "18%" }].map((x) => <div key={x.name} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"><div><p className="text-xs font-medium">{x.name}</p><p className="mt-1 text-[11px] text-muted-foreground">{x.amount}</p></div><Badge variant="outline" className="text-[10px]">{x.percent}</Badge></div>)}</CardContent></Card></div>}
            <div className="flex flex-col gap-1"><h2 className="text-sm font-semibold">{active === "Live tracking" ? "Active vehicle feed" : `All ${active.toLowerCase()}`}</h2><p className="text-xs text-muted-foreground">Search, filter by status, sort columns, inspect records or export CSV</p></div>
            <DataTable rows={currentRows} cols={columns[active]} search={search} />
          </>}
          <p className="pb-2 text-center text-[10px] text-muted-foreground">BusOS Admin · Interactive demo · All figures and records are sample data</p>
        </div></main>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{createdLabel}</DialogTitle><DialogDescription>Add a sample record to this local demo workspace. Nothing is sent to a server.</DialogDescription></DialogHeader><form onSubmit={submitCreate} className="space-y-3"><div><label className="mb-1.5 block text-xs font-medium">{active === "Ticket sales" || active === "Overview" ? "Passenger name" : "Name / description"}</label><Input value={createdName} onChange={(event) => setCreatedName(event.target.value)} placeholder={active === "Ticket sales" || active === "Overview" ? "Enter passenger name" : `Enter ${active.toLowerCase()} name or description`} required /></div>{isBookingForm && <><div><label className="mb-1.5 block text-xs font-medium">Route</label><Input value="Dhaka → Chattogram" readOnly /></div><div><label className="mb-1.5 block text-xs font-medium">Departure</label><Input value={todayLabel + " · 02:00 PM"} readOnly /></div></>}<DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit">{active === "Ticket sales" || active === "Overview" ? "Create demo booking" : `Add demo ${active === "Maintenance" ? "work order" : active === "Inventory" ? "item" : active === "Users & roles" ? "invitation" : active === "Crew & staff" ? "crew member" : "counter"}`}</Button></DialogFooter></form></DialogContent></Dialog>
    </div>
  );
}

export default App;
