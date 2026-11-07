import { useMemo, useState } from "react";
import {
  Activity,  ArrowUpRight, Bus, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, Clock3, Command,
  Download, Ellipsis, LayoutDashboard, LifeBuoy, MapPinned, Menu,
  MoreHorizontal, Plus, Search, Ticket, Users, Wallet,
  X, Zap,
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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Ticket sales", icon: Ticket, count: "24" },
  { label: "Trips & schedules", icon: CalendarDays },
  { label: "Routes", icon: MapPinned },
  { label: "Passengers", icon: Users },
];
const operations = [
  { label: "Fleet", icon: Bus },
  { label: "Finance", icon: Wallet },
  { label: "Live tracking", icon: Activity },
];

const departures = [
  { id: "TR-2048", route: "Dhaka", destination: "Chattogram", time: "09:30 AM", coach: "Green Line · AC", seats: "28 / 40", status: "Boarding", amount: "৳ 32,000" },
  { id: "TR-2049", route: "Dhaka", destination: "Sylhet", time: "10:15 AM", coach: "Hanif Enterprise · AC", seats: "34 / 40", status: "On time", amount: "৳ 27,200" },
  { id: "TR-2050", route: "Dhaka", destination: "Rajshahi", time: "11:00 AM", coach: "Shyamoli NR · Non-AC", seats: "19 / 36", status: "On time", amount: "৳ 14,250" },
  { id: "TR-2051", route: "Chattogram", destination: "Cox's Bazar", time: "11:45 AM", coach: "Saintmartin · AC", seats: "31 / 40", status: "Delayed", amount: "৳ 24,800" },
];

const sales = [38, 54, 46, 68, 52, 78, 62, 88, 70, 95, 74, 84, 66, 100, 82, 91, 72, 86, 63, 78, 57, 73, 49, 67];

function App() {
  const [active, setActive] = useState("Overview");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState("Today");

  const filteredDepartures = useMemo(() => departures.filter((trip) =>
    [trip.id, trip.route, trip.destination, trip.coach].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const SidebarContent = () => (
    <>
      <div className="flex h-[72px] items-center gap-3 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bus className="size-5" strokeWidth={2.3} />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight">BusOS</p>
          <p className="text-[11px] text-muted-foreground">BUSINESS OPERATIONS</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto size-8 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X className="size-4" />
        </Button>
      </div>
      <div className="px-4 pb-4">
        <button className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground"><Command className="size-4" /></div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">Dhaka Express Ltd.</p>
            <p className="text-[11px] text-muted-foreground">Administrator</p>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
      <div className="px-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;
            return (
              <button key={item.label} onClick={() => { setActive(item.label); setMobileOpen(false); }} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="size-[17px]" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count && <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${selected ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{item.count}</span>}
              </button>
            );
          })}
        </nav>
        <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Management</p>
        <nav className="space-y-1">
          {operations.map((item) => {
            const Icon = item.icon;
            const selected = active === item.label;
            return (
              <button key={item.label} onClick={() => { setActive(item.label); setMobileOpen(false); }} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                <Icon className="size-[17px]" /><span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-3">
        <div className="rounded-xl border bg-muted/40 p-3">
          <div className="mb-2 flex items-center gap-2"><LifeBuoy className="size-4" /><span className="text-xs font-semibold">Need a hand?</span></div>
          <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">Visit the help center for setup guides and support.</p>
          <Button variant="outline" size="sm" className="h-8 w-full bg-background text-xs">Help center <ChevronRight className="ml-auto size-3.5" /></Button>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="size-8"><AvatarFallback className="bg-muted text-[11px] font-semibold">RA</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Reaz Ahmed</p><p className="text-[11px] text-muted-foreground">Owner account</p></div>
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </div>
      </div>
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
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="relative hidden w-[220px] md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search anything..." className="h-9 border-0 bg-muted/70 pl-9 text-xs shadow-none focus-visible:ring-1" /></div>
            <Button variant="outline" size="sm" className="hidden h-9 gap-2 text-xs sm:flex"><CalendarDays className="size-3.5" /> Nov 07, 2026</Button>
            <Button variant="ghost" size="icon" className="relative size-9" aria-label="Notifications"><Activity className="size-[18px]" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-foreground ring-2 ring-background" /></Button>
            <Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" />
            <Avatar className="size-8"><AvatarFallback className="bg-primary text-[10px] font-semibold text-primary-foreground">RA</AvatarFallback></Avatar>
          </div>
        </header>

        <main className="min-h-screen px-4 pb-8 pt-[100px] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px] space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><div className="mb-2 flex items-center gap-2"><Badge variant="outline" className="rounded-md bg-background text-[10px] font-medium tracking-wide">SATURDAY, NOVEMBER 07</Badge><span className="size-1 rounded-full bg-muted-foreground" /><span className="text-[11px] text-muted-foreground">Live operations</span><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/30" /><span className="relative inline-flex size-2 rounded-full bg-foreground" /></span></div><h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">Good afternoon, Reaz <span className="inline-block origin-[70%_70%] animate-pulse">✦</span></h1><p className="mt-1 text-sm text-muted-foreground">Here’s what’s happening across your transport business today.</p></div>
              <div className="flex items-center gap-2"><Button variant="outline" className="h-9 gap-2 bg-background text-xs"><Download className="size-3.5" /> Export report</Button><Button className="h-9 gap-2 text-xs"><Plus className="size-4" /> New booking</Button></div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Total ticket sales", value: "৳ 2,84,500", change: "+12.8%", note: "vs. yesterday", icon: Ticket, trend: "up" },
                { title: "Tickets booked", value: "1,248", change: "+8.2%", note: "vs. yesterday", icon: Users, trend: "up" },
                { title: "Active trips", value: "36", change: "4 boarding", note: "across all routes", icon: Bus, trend: "neutral" },
                { title: "Available seats", value: "482", change: "62% filled", note: "today's schedule", icon: Activity, trend: "neutral" },
              ].map((item) => {
                const Icon = item.icon;
                return <Card key={item.title} className="gap-3 rounded-xl border bg-card py-4 shadow-none">
                  <CardContent className="px-4 sm:px-5">
                    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{item.title}</p><div className="flex size-8 items-center justify-center rounded-lg border bg-muted/50"><Icon className="size-4 text-muted-foreground" /></div></div>
                    <div className="flex items-end justify-between gap-2"><p className="text-[25px] font-semibold tracking-tight tabular-nums">{item.value}</p><span className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-foreground">{item.trend === "up" ? <ArrowUpRight className="size-3" /> : <Check className="size-3" />}{item.change}</span></div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{item.note}</p>
                  </CardContent>
                </Card>;
              })}
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
              <Card className="gap-4 rounded-xl border shadow-none">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 pb-0">
                  <div><CardTitle className="text-sm font-semibold">Revenue overview</CardTitle><CardDescription className="mt-1 text-xs">Ticket revenue performance over time</CardDescription></div>
                  <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">{["Today", "Week", "Month"].map((p) => <Button key={p} size="sm" variant={period === p ? "secondary" : "ghost"} className={`h-7 px-2.5 text-[10px] ${period === p ? "bg-background shadow-sm" : ""}`} onClick={() => setPeriod(p)}>{p}</Button>)}</div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="mb-4 flex items-end gap-3"><p className="text-2xl font-semibold tracking-tight">৳ 2,84,500</p><span className="mb-1 flex items-center gap-1 text-[11px] font-medium"><ArrowUpRight className="size-3.5" /> 12.8%</span></div>
                  <div className="relative h-[190px] w-full">
                    <div className="absolute inset-0 flex flex-col justify-between">{["৳ 3L", "৳ 2L", "৳ 1L", "৳ 0"].map((label) => <div key={label} className="flex items-center gap-3"><span className="w-8 text-[10px] text-muted-foreground">{label}</span><div className="h-px flex-1 border-t border-dashed" /></div>)}</div>
                    <div className="absolute bottom-0 left-11 right-0 top-1 flex items-end gap-[5px]">{sales.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className={`w-full rounded-t-[3px] transition-all hover:opacity-70 ${index === 13 ? "bg-primary" : "bg-foreground/15"}`} style={{ height: `${height}%` }} title={`৳ ${height * 1000}`} /></div>)}</div>
                  </div>
                  <div className="ml-11 mt-2 flex justify-between text-[10px] text-muted-foreground"><span>06 AM</span><span>09 AM</span><span>12 PM</span><span>03 PM</span><span>06 PM</span><span>09 PM</span></div>
                </CardContent>
              </Card>

              <Card className="gap-4 rounded-xl border shadow-none">
                <CardHeader className="px-5 pb-0"><div className="flex items-center justify-between"><div><CardTitle className="text-sm font-semibold">Booking breakdown</CardTitle><CardDescription className="mt-1 text-xs">Today's booking channels</CardDescription></div><Button variant="ghost" size="icon" className="size-8"><Ellipsis className="size-4" /></Button></div></CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="flex items-center justify-center py-3"><div className="relative flex size-[156px] items-center justify-center rounded-full" style={{ background: "conic-gradient(#171717 0deg 216deg, #777 216deg 288deg, #c9c9c9 288deg 342deg, #e8e8e8 342deg 360deg)" }}><div className="flex size-[112px] flex-col items-center justify-center rounded-full bg-card"><span className="text-2xl font-semibold tracking-tight">1,248</span><span className="text-[10px] text-muted-foreground">Total bookings</span></div></div></div>
                  <div className="space-y-3 pt-2">
                    {[{ name: "Counter sales", value: "60%", amount: "749", color: "bg-[#171717]" }, { name: "Online booking", value: "20%", amount: "250", color: "bg-[#777]" }, { name: "Mobile app", value: "15%", amount: "187", color: "bg-[#c9c9c9]" }, { name: "Agent sales", value: "5%", amount: "62", color: "bg-[#e8e8e8]" }].map((item) => <div key={item.name} className="flex items-center gap-2.5"><span className={`size-2.5 rounded-[3px] ${item.color}`} /><span className="flex-1 text-xs text-muted-foreground">{item.name}</span><span className="text-xs font-medium tabular-nums">{item.amount}</span><span className="w-9 text-right text-[11px] text-muted-foreground">{item.value}</span></div>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="gap-0 overflow-hidden rounded-xl border shadow-none">
              <CardHeader className="flex flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div><CardTitle className="text-sm font-semibold">Upcoming departures</CardTitle><CardDescription className="mt-1 text-xs">Monitor today's trips and boarding status</CardDescription></div>
                <div className="flex items-center gap-2"><div className="relative flex-1 sm:w-[210px]"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trips..." className="h-8 pl-8 text-xs" /></div><Button variant="outline" size="sm" className="h-8 gap-1.5 bg-background text-xs">View all <ChevronRight className="size-3.5" /></Button></div>
              </CardHeader>
              <Separator />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="bg-muted/30 hover:bg-muted/30"><TableHead className="pl-5 text-[10px] font-semibold uppercase tracking-wide">Trip / Route</TableHead><TableHead className="text-[10px] font-semibold uppercase tracking-wide">Departure</TableHead><TableHead className="text-[10px] font-semibold uppercase tracking-wide">Coach</TableHead><TableHead className="text-[10px] font-semibold uppercase tracking-wide">Seats sold</TableHead><TableHead className="text-[10px] font-semibold uppercase tracking-wide">Status</TableHead><TableHead className="text-right text-[10px] font-semibold uppercase tracking-wide">Revenue</TableHead><TableHead className="w-10" /></TableRow></TableHeader>
                  <TableBody>{filteredDepartures.map((trip) => <TableRow key={trip.id} className="text-xs"><TableCell className="py-3 pl-5"><p className="font-semibold">{trip.id}</p><p className="mt-1 text-[11px] text-muted-foreground">{trip.route} <ChevronRight className="inline size-3" /> {trip.destination}</p></TableCell><TableCell className="whitespace-nowrap text-muted-foreground">{trip.time}</TableCell><TableCell className="min-w-[150px] text-muted-foreground">{trip.coach}</TableCell><TableCell><span className="font-medium tabular-nums">{trip.seats}</span></TableCell><TableCell><Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${trip.status === "Delayed" ? "border-foreground/30 bg-muted text-foreground" : trip.status === "Boarding" ? "border-foreground/20 bg-foreground text-background" : "bg-background text-muted-foreground"}`}>{trip.status}</Badge></TableCell><TableCell className="text-right font-medium tabular-nums">{trip.amount}</TableCell><TableCell><Button variant="ghost" size="icon" className="size-7"><MoreHorizontal className="size-4" /></Button></TableCell></TableRow>)}</TableBody>
                </Table>
                {filteredDepartures.length === 0 && <div className="py-10 text-center text-xs text-muted-foreground">No trips match your search.</div>}
              </div>
              <div className="flex items-center justify-between border-t px-5 py-3"><p className="text-[11px] text-muted-foreground">Showing {filteredDepartures.length} of 24 scheduled trips</p><div className="flex gap-1"><Button variant="outline" size="icon" className="size-7" disabled><ChevronLeft className="size-3.5" /></Button><Button variant="outline" size="icon" className="size-7"><ChevronRight className="size-3.5" /></Button></div></div>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-xl border shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Clock3 className="size-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">On-time departures</p><p className="mt-1 text-[11px] text-muted-foreground">32 of 36 trips on schedule</p></div><span className="text-sm font-semibold">89%</span></CardContent></Card>
              <Card className="rounded-xl border shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Bus className="size-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">Fleet availability</p><p className="mt-1 text-[11px] text-muted-foreground">42 buses ready for dispatch</p></div><span className="text-sm font-semibold">92%</span></CardContent></Card>
              <Card className="rounded-xl border shadow-none"><CardContent className="flex items-center gap-3 p-4"><div className="flex size-9 items-center justify-center rounded-lg bg-muted"><Zap className="size-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold">System status</p><p className="mt-1 text-[11px] text-muted-foreground">All services operational</p></div><Badge variant="outline" className="gap-1 rounded-md text-[10px]"><span className="size-1.5 rounded-full bg-foreground" /> Healthy</Badge></CardContent></Card>
            </div>
            <p className="pb-2 text-center text-[10px] text-muted-foreground">BusOS Admin · Demo dashboard · Sample data only</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
