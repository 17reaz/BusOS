import { useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bus, CalendarDays, CalendarClock,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDollarSign,
  Clock3, Command, CreditCard, Download, Filter, Gauge, LayoutDashboard,
  LifeBuoy, MapPin, MapPinned, Menu, MoreHorizontal, Navigation, Plus,
  Search, Settings, SlidersHorizontal, Ticket, Users, Wallet, Wifi, X,
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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RowData = Record<string, string>;
type Column = { key: string; label: string; className?: string };

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

const initialBookings: RowData[] = [
  { id: "BK-80421", passenger: "Nusrat Jahan", route: "Dhaka → Chattogram", seat: "A2, A3", trip: "TR-2048", date: "07 Nov, 09:30", amount: "৳ 2,400", status: "Confirmed", channel: "Counter" },
  { id: "BK-80420", passenger: "Tanvir Hasan", route: "Dhaka → Sylhet", seat: "B4", trip: "TR-2049", date: "07 Nov, 10:15", amount: "৳ 1,200", status: "Confirmed", channel: "Online" },
  { id: "BK-80419", passenger: "Sadia Akter", route: "Dhaka → Rajshahi", seat: "C1, C2", trip: "TR-2050", date: "07 Nov, 11:00", amount: "৳ 1,800", status: "Pending", channel: "Agent" },
  { id: "BK-80418", passenger: "Mahmud Rahman", route: "Chattogram → Cox's Bazar", seat: "D5", trip: "TR-2051", date: "07 Nov, 11:45", amount: "৳ 1,000", status: "Cancelled", channel: "Counter" },
  { id: "BK-80417", passenger: "Farhana Islam", route: "Dhaka → Khulna", seat: "A7", trip: "TR-2052", date: "07 Nov, 12:30", amount: "৳ 1,350", status: "Confirmed", channel: "Mobile app" },
];
const trips: RowData[] = [
  { id: "TR-2048", route: "Dhaka → Chattogram", departure: "09:30 AM", coach: "Green Line · AC", seats: "28 / 40", driver: "Rafiqul Islam", status: "Boarding" },
  { id: "TR-2049", route: "Dhaka → Sylhet", departure: "10:15 AM", coach: "Hanif Enterprise · AC", seats: "34 / 40", driver: "Jamal Uddin", status: "On time" },
  { id: "TR-2050", route: "Dhaka → Rajshahi", departure: "11:00 AM", coach: "Shyamoli NR · Non-AC", seats: "19 / 36", driver: "Abdul Karim", status: "On time" },
  { id: "TR-2051", route: "Chattogram → Cox's Bazar", departure: "11:45 AM", coach: "Saintmartin · AC", seats: "31 / 40", driver: "Sohel Rana", status: "Delayed" },
  { id: "TR-2052", route: "Dhaka → Khulna", departure: "12:30 PM", coach: "Ena Transport · AC", seats: "22 / 40", driver: "Nasir Ahmed", status: "Scheduled" },
];
const routes: RowData[] = [
  { id: "RT-001", from: "Dhaka", to: "Chattogram", distance: "264 km", duration: "6h 30m", fare: "৳ 1,200", trips: "8 daily", status: "Active" },
  { id: "RT-002", from: "Dhaka", to: "Sylhet", distance: "241 km", duration: "5h 15m", fare: "৳ 1,000", trips: "6 daily", status: "Active" },
  { id: "RT-003", from: "Dhaka", to: "Rajshahi", distance: "245 km", duration: "5h 45m", fare: "৳ 900", trips: "5 daily", status: "Active" },
  { id: "RT-004", from: "Chattogram", to: "Cox's Bazar", distance: "150 km", duration: "4h", fare: "৳ 800", trips: "4 daily", status: "Active" },
  { id: "RT-005", from: "Dhaka", to: "Khulna", distance: "270 km", duration: "7h", fare: "৳ 1,100", trips: "3 daily", status: "Review" },
];
const passengers: RowData[] = [
  { id: "PS-10082", name: "Nusrat Jahan", phone: "01712-345678", bookings: "18", spent: "৳ 21,600", lastTrip: "07 Nov 2026", status: "Regular" },
  { id: "PS-10081", name: "Tanvir Hasan", phone: "01819-223344", bookings: "12", spent: "৳ 14,400", lastTrip: "07 Nov 2026", status: "Regular" },
  { id: "PS-10080", name: "Sadia Akter", phone: "01911-998877", bookings: "7", spent: "৳ 8,100", lastTrip: "06 Nov 2026", status: "New" },
  { id: "PS-10079", name: "Mahmud Rahman", phone: "01610-778899", bookings: "24", spent: "৳ 28,800", lastTrip: "05 Nov 2026", status: "VIP" },
  { id: "PS-10078", name: "Farhana Islam", phone: "01515-665544", bookings: "4", spent: "৳ 4,800", lastTrip: "04 Nov 2026", status: "New" },
];
const fleet: RowData[] = [
  { id: "DHK-METRO-11-2048", coach: "Green Line · Volvo B11R", type: "AC Sleeper", seats: "40", driver: "Rafiqul Islam", mileage: "182,400 km", status: "On trip" },
  { id: "DHK-METRO-11-2049", coach: "Hanif · Scania K360", type: "AC Business", seats: "40", driver: "Jamal Uddin", mileage: "156,200 km", status: "Available" },
  { id: "DHK-METRO-11-2050", coach: "Shyamoli · Hino", type: "Non-AC", seats: "36", driver: "Abdul Karim", mileage: "204,800 km", status: "On trip" },
  { id: "CTG-METRO-11-2051", coach: "Saintmartin · Volvo", type: "AC Business", seats: "40", driver: "Sohel Rana", mileage: "98,300 km", status: "Maintenance" },
  { id: "DHK-METRO-11-2052", coach: "Ena · Hyundai", type: "AC Business", seats: "40", driver: "Nasir Ahmed", mileage: "121,700 km", status: "Available" },
];
const finance: RowData[] = [
  { id: "TXN-90128", detail: "Ticket sales · TR-2048", category: "Revenue", date: "07 Nov, 09:42", method: "Cash", amount: "+ ৳ 32,000", status: "Completed" },
  { id: "TXN-90127", detail: "Fuel · Coach 2048", category: "Expense", date: "07 Nov, 08:10", method: "Company card", amount: "− ৳ 8,500", status: "Completed" },
  { id: "TXN-90126", detail: "Ticket sales · TR-2049", category: "Revenue", date: "07 Nov, 07:55", method: "Online", amount: "+ ৳ 27,200", status: "Completed" },
  { id: "TXN-90125", detail: "Workshop · Coach 2051", category: "Expense", date: "06 Nov, 18:30", method: "Bank transfer", amount: "− ৳ 12,000", status: "Pending" },
  { id: "TXN-90124", detail: "Agent settlement", category: "Payout", date: "06 Nov, 16:20", method: "Bank transfer", amount: "− ৳ 18,500", status: "Completed" },
];
const tracking: RowData[] = [
  { id: "TR-2048", coach: "Green Line · Dhaka–Chattogram", location: "Cumilla bypass", speed: "72 km/h", updated: "Just now", eta: "12:05 PM", status: "On route" },
  { id: "TR-2049", coach: "Hanif · Dhaka–Sylhet", location: "Bhairab bridge", speed: "64 km/h", updated: "1 min ago", eta: "03:20 PM", status: "On route" },
  { id: "TR-2050", coach: "Shyamoli · Dhaka–Rajshahi", location: "Tangail", speed: "0 km/h", updated: "3 min ago", eta: "04:10 PM", status: "Stopped" },
  { id: "TR-2051", coach: "Saintmartin · Chattogram–Cox's Bazar", location: "Patiya", speed: "48 km/h", updated: "Just now", eta: "02:15 PM", status: "Delayed" },
];

const pageConfig: Record<string, { title: string; description: string; action: string }> = {
  "Ticket sales": { title: "Ticket sales", description: "Manage reservations, counter sales and passenger tickets.", action: "New booking" },
  "Trips & schedules": { title: "Trips & schedules", description: "Plan departures, assign coaches and monitor trip status.", action: "Create trip" },
  Routes: { title: "Routes", description: "Manage your route network, distance, journey time and fares.", action: "Add route" },
  Passengers: { title: "Passengers", description: "Passenger directory, booking history and customer activity.", action: "Add passenger" },
  Fleet: { title: "Fleet management", description: "Track buses, coach assignments and vehicle availability.", action: "Add vehicle" },
  Finance: { title: "Finance", description: "Monitor revenue, operating costs and settlement activity.", action: "Add transaction" },
  "Live tracking": { title: "Live tracking", description: "Monitor active coaches and their latest reported locations.", action: "Refresh locations" },
};

const columns: Record<string, Column[]> = {
  "Ticket sales": [
    { key: "id", label: "Booking ID" }, { key: "passenger", label: "Passenger" },
    { key: "route", label: "Route" }, { key: "seat", label: "Seat(s)" },
    { key: "date", label: "Departure" }, { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ],
  "Trips & schedules": [
    { key: "id", label: "Trip ID" }, { key: "route", label: "Route" },
    { key: "departure", label: "Departure" }, { key: "coach", label: "Coach" },
    { key: "seats", label: "Seats sold" }, { key: "driver", label: "Driver" },
    { key: "status", label: "Status" },
  ],
  Routes: [
    { key: "id", label: "Route ID" }, { key: "from", label: "Origin" },
    { key: "to", label: "Destination" }, { key: "distance", label: "Distance" },
    { key: "duration", label: "Duration" }, { key: "fare", label: "Base fare" },
    { key: "trips", label: "Daily trips" }, { key: "status", label: "Status" },
  ],
  Passengers: [
    { key: "id", label: "Passenger ID" }, { key: "name", label: "Name" },
    { key: "phone", label: "Phone" }, { key: "bookings", label: "Bookings" },
    { key: "spent", label: "Total spent" }, { key: "lastTrip", label: "Last trip" },
    { key: "status", label: "Segment" },
  ],
  Fleet: [
    { key: "id", label: "Registration" }, { key: "coach", label: "Vehicle" },
    { key: "type", label: "Class" }, { key: "seats", label: "Seats" },
    { key: "driver", label: "Assigned driver" }, { key: "mileage", label: "Mileage" },
    { key: "status", label: "Status" },
  ],
  Finance: [
    { key: "id", label: "Transaction ID" }, { key: "detail", label: "Description" },
    { key: "category", label: "Type" }, { key: "date", label: "Date" },
    { key: "method", label: "Method" }, { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ],
  "Live tracking": [
    { key: "id", label: "Trip" }, { key: "coach", label: "Coach / Route" },
    { key: "location", label: "Last location" }, { key: "speed", label: "Speed" },
    { key: "updated", label: "Last update" }, { key: "eta", label: "Estimated arrival" },
    { key: "status", label: "Status" },
  ],
};

const dataset: Record<string, RowData[]> = {
  "Ticket sales": initialBookings, "Trips & schedules": trips, Routes: routes,
  Passengers: passengers, Fleet: fleet, Finance: finance, "Live tracking": tracking,
};

const salesBars = [38, 54, 46, 68, 52, 78, 62, 88, 70, 95, 74, 84, 66, 100, 82, 91, 72, 86, 63, 78, 57, 73, 49, 67];

function StatusBadge({ value }: { value: string }) {
  const dark = ["Boarding", "Confirmed", "Active", "Completed", "On route", "Available", "VIP"].includes(value);
  return <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${dark ? "border-foreground/20 bg-foreground text-background" : "bg-muted/50 text-muted-foreground"}`}>{value}</Badge>;
}

function Metric({ title, value, note, icon: Icon, change }: { title: string; value: string; note: string; icon: React.ElementType; change?: string }) {
  return <Card className="gap-3 rounded-xl border bg-card py-4 shadow-none"><CardContent className="px-4 sm:px-5">
    <div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{title}</p><div className="flex size-8 items-center justify-center rounded-lg border bg-muted/50"><Icon className="size-4 text-muted-foreground" /></div></div>
    <div className="flex items-end justify-between gap-2"><p className="text-[25px] font-semibold tracking-tight tabular-nums">{value}</p>{change && <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold"><ArrowUpRight className="size-3" />{change}</span>}</div>
    <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
  </CardContent></Card>;
}

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
  const filteredCount = useMemo(() => currentRows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())).length, [currentRows, search]);

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
            {active === "Live tracking" && <Card className="gap-4 rounded-xl border shadow-none"><CardHeader className="pb-0"><CardTitle className="text-sm">Live operations map</CardTitle><CardDescription className="text-xs">Schematic demo view · GPS locations are sample data</CardDescription></CardHeader><CardContent><div className="relative overflow-hidden rounded-xl border bg-muted/30 p-5"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(90deg, transparent 49%, hsl(var(--border)) 50%, transparent 51%), linear-gradient(transparent 49%, hsl(var(--border)) 50%, transparent 51%)", backgroundSize: "48px 48px" }} /><div className="relative grid gap-3 sm:grid-cols-2"><div className="rounded-lg border bg-background/95 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-foreground" /> TR-2048 · Cumilla</div><p className="mt-1 text-[11px] text-muted-foreground">Dhaka → Chattogram · ETA 12:05 PM</p></div><div className="rounded-lg border bg-background/95 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-foreground" /> TR-2049 · Bhairab</div><p className="mt-1 text-[11px] text-muted-foreground">Dhaka → Sylhet · ETA 03:20 PM</p></div><div className="rounded-lg border bg-background/95 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-muted-foreground" /> TR-2050 · Tangail</div><p className="mt-1 text-[11px] text-muted-foreground">Dhaka → Rajshahi · Stopped 3 min</p></div><div className="rounded-lg border bg-background/95 p-3"><div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-foreground" /> TR-2051 · Patiya</div><p className="mt-1 text-[11px] text-muted-foreground">Chattogram → Cox's Bazar · Delayed</p></div></div><div className="relative mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground"><MapPin className="size-3.5" /> Bangladesh · schematic map placeholder</div></div></CardContent></Card>}
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
