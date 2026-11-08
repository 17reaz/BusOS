import { Activity, Bus, Building2, CalendarDays, FileBarChart, LayoutDashboard, MapPinned, Package, Ticket, Users, UserRoundCog, Wallet, Wrench } from "lucide-react";

export type RowData = Record<string, string>;
export type Column = { key: string; label: string; className?: string };

export const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Ticket sales", icon: Ticket, count: "24" },
  { label: "Trips & schedules", icon: CalendarDays },
  { label: "Routes", icon: MapPinned },
  { label: "Passengers", icon: Users },
  { label: "Crew & staff", icon: UserRoundCog },
];
export const operations = [
  { label: "Fleet", icon: Bus },
  { label: "Finance", icon: Wallet },
  { label: "Live tracking", icon: Activity },
  { label: "Maintenance", icon: Wrench },
  { label: "Inventory", icon: Package },
  { label: "Counters", icon: Building2 },
  { label: "Users & roles", icon: UserRoundCog },
  { label: "Reports", icon: FileBarChart },
];

export const initialBookings: RowData[] = [
  { id: "BK-80421", passenger: "Nusrat Jahan", route: "Dhaka → Chattogram", seat: "A2, A3", trip: "TR-2048", date: "07 Nov, 09:30", amount: "৳ 2,400", status: "Confirmed", channel: "Counter" },
  { id: "BK-80420", passenger: "Tanvir Hasan", route: "Dhaka → Sylhet", seat: "B4", trip: "TR-2049", date: "07 Nov, 10:15", amount: "৳ 1,200", status: "Confirmed", channel: "Online" },
  { id: "BK-80419", passenger: "Sadia Akter", route: "Dhaka → Rajshahi", seat: "C1, C2", trip: "TR-2050", date: "07 Nov, 11:00", amount: "৳ 1,800", status: "Pending", channel: "Agent" },
  { id: "BK-80418", passenger: "Mahmud Rahman", route: "Chattogram → Cox's Bazar", seat: "D5", trip: "TR-2051", date: "07 Nov, 11:45", amount: "৳ 1,000", status: "Cancelled", channel: "Counter" },
  { id: "BK-80417", passenger: "Farhana Islam", route: "Dhaka → Khulna", seat: "A7", trip: "TR-2052", date: "07 Nov, 12:30", amount: "৳ 1,350", status: "Confirmed", channel: "Mobile app" },
];
export const trips: RowData[] = [
  { id: "TR-2048", route: "Dhaka → Chattogram", departure: "09:30 AM", coach: "Green Line · AC", seats: "28 / 40", driver: "Rafiqul Islam", status: "Boarding" },
  { id: "TR-2049", route: "Dhaka → Sylhet", departure: "10:15 AM", coach: "Hanif Enterprise · AC", seats: "34 / 40", driver: "Jamal Uddin", status: "On time" },
  { id: "TR-2050", route: "Dhaka → Rajshahi", departure: "11:00 AM", coach: "Shyamoli NR · Non-AC", seats: "19 / 36", driver: "Abdul Karim", status: "On time" },
  { id: "TR-2051", route: "Chattogram → Cox's Bazar", departure: "11:45 AM", coach: "Saintmartin · AC", seats: "31 / 40", driver: "Sohel Rana", status: "Delayed" },
  { id: "TR-2052", route: "Dhaka → Khulna", departure: "12:30 PM", coach: "Ena Transport · AC", seats: "22 / 40", driver: "Nasir Ahmed", status: "Scheduled" },
];
export const routes: RowData[] = [
  { id: "RT-001", from: "Dhaka", to: "Chattogram", distance: "264 km", duration: "6h 30m", fare: "৳ 1,200", trips: "8 daily", status: "Active" },
  { id: "RT-002", from: "Dhaka", to: "Sylhet", distance: "241 km", duration: "5h 15m", fare: "৳ 1,000", trips: "6 daily", status: "Active" },
  { id: "RT-003", from: "Dhaka", to: "Rajshahi", distance: "245 km", duration: "5h 45m", fare: "৳ 900", trips: "5 daily", status: "Active" },
  { id: "RT-004", from: "Chattogram", to: "Cox's Bazar", distance: "150 km", duration: "4h", fare: "৳ 800", trips: "4 daily", status: "Active" },
  { id: "RT-005", from: "Dhaka", to: "Khulna", distance: "270 km", duration: "7h", fare: "৳ 1,100", trips: "3 daily", status: "Review" },
];
export const passengers: RowData[] = [
  { id: "PS-10082", name: "Nusrat Jahan", phone: "01712-345678", bookings: "18", spent: "৳ 21,600", lastTrip: "07 Nov 2026", status: "Regular" },
  { id: "PS-10081", name: "Tanvir Hasan", phone: "01819-223344", bookings: "12", spent: "৳ 14,400", lastTrip: "07 Nov 2026", status: "Regular" },
  { id: "PS-10080", name: "Sadia Akter", phone: "01911-998877", bookings: "7", spent: "৳ 8,100", lastTrip: "06 Nov 2026", status: "New" },
  { id: "PS-10079", name: "Mahmud Rahman", phone: "01610-778899", bookings: "24", spent: "৳ 28,800", lastTrip: "05 Nov 2026", status: "VIP" },
  { id: "PS-10078", name: "Farhana Islam", phone: "01515-665544", bookings: "4", spent: "৳ 4,800", lastTrip: "04 Nov 2026", status: "New" },
];
export const fleet: RowData[] = [
  { id: "DHK-METRO-11-2048", coach: "Green Line · Volvo B11R", type: "AC Sleeper", seats: "40", driver: "Rafiqul Islam", mileage: "182,400 km", status: "On trip" },
  { id: "DHK-METRO-11-2049", coach: "Hanif · Scania K360", type: "AC Business", seats: "40", driver: "Jamal Uddin", mileage: "156,200 km", status: "Available" },
  { id: "DHK-METRO-11-2050", coach: "Shyamoli · Hino", type: "Non-AC", seats: "36", driver: "Abdul Karim", mileage: "204,800 km", status: "On trip" },
  { id: "CTG-METRO-11-2051", coach: "Saintmartin · Volvo", type: "AC Business", seats: "40", driver: "Sohel Rana", mileage: "98,300 km", status: "Maintenance" },
  { id: "DHK-METRO-11-2052", coach: "Ena · Hyundai", type: "AC Business", seats: "40", driver: "Nasir Ahmed", mileage: "121,700 km", status: "Available" },
];
export const finance: RowData[] = [
  { id: "TXN-90128", detail: "Ticket sales · TR-2048", category: "Revenue", date: "07 Nov, 09:42", method: "Cash", amount: "+ ৳ 32,000", status: "Completed" },
  { id: "TXN-90127", detail: "Fuel · Coach 2048", category: "Expense", date: "07 Nov, 08:10", method: "Company card", amount: "− ৳ 8,500", status: "Completed" },
  { id: "TXN-90126", detail: "Ticket sales · TR-2049", category: "Revenue", date: "07 Nov, 07:55", method: "Online", amount: "+ ৳ 27,200", status: "Completed" },
  { id: "TXN-90125", detail: "Workshop · Coach 2051", category: "Expense", date: "06 Nov, 18:30", method: "Bank transfer", amount: "− ৳ 12,000", status: "Pending" },
  { id: "TXN-90124", detail: "Agent settlement", category: "Payout", date: "06 Nov, 16:20", method: "Bank transfer", amount: "− ৳ 18,500", status: "Completed" },
];
export const tracking: RowData[] = [
  { id: "TR-2048", coach: "Green Line · Dhaka–Chattogram", location: "Cumilla bypass", speed: "72 km/h", updated: "Just now", eta: "12:05 PM", status: "On route" },
  { id: "TR-2049", coach: "Hanif · Dhaka–Sylhet", location: "Bhairab bridge", speed: "64 km/h", updated: "1 min ago", eta: "03:20 PM", status: "On route" },
  { id: "TR-2050", coach: "Shyamoli · Dhaka–Rajshahi", location: "Tangail", speed: "0 km/h", updated: "3 min ago", eta: "04:10 PM", status: "Stopped" },
  { id: "TR-2051", coach: "Saintmartin · Chattogram–Cox's Bazar", location: "Patiya", speed: "48 km/h", updated: "Just now", eta: "02:15 PM", status: "Delayed" },
];

export const crew: RowData[] = [
  { id: "STF-001", name: "Rafiqul Islam", role: "Driver", phone: "01711-220011", license: "Professional · Valid", assigned: "TR-2048", status: "Active" },
  { id: "STF-002", name: "Jamal Uddin", role: "Driver", phone: "01811-330022", license: "Professional · Valid", assigned: "TR-2049", status: "Active" },
  { id: "STF-003", name: "Abdul Karim", role: "Driver", phone: "01911-440033", license: "Renewal due", assigned: "Unassigned", status: "Review" },
  { id: "STF-004", name: "Sohel Rana", role: "Conductor", phone: "01611-550044", license: "Not required", assigned: "TR-2051", status: "Active" },
];

export const maintenance: RowData[] = [
  { id: "WO-1008", vehicle: "DHK-METRO-11-2048", service: "Preventive inspection", due: "10 Nov 2026", workshop: "Dhaka Central", cost: "৳ 8,500", status: "Scheduled" },
  { id: "WO-1007", vehicle: "CTG-METRO-11-2051", service: "Engine diagnostics", due: "08 Nov 2026", workshop: "Chattogram Depot", cost: "৳ 24,000", status: "In progress" },
  { id: "WO-1006", vehicle: "DHK-METRO-11-2050", service: "Brake pad replacement", due: "06 Nov 2026", workshop: "Dhaka Central", cost: "৳ 12,000", status: "Completed" },
];

export const inventory: RowData[] = [
  { id: "INV-001", item: "Engine oil 15W-40", category: "Lubricants", stock: "42", unit: "Litres", reorder: "20", status: "Available" },
  { id: "INV-002", item: "Brake pad set", category: "Spare parts", stock: "8", unit: "Sets", reorder: "10", status: "Low stock" },
  { id: "INV-003", item: "Air filter", category: "Spare parts", stock: "24", unit: "Pieces", reorder: "12", status: "Available" },
];

export const counters: RowData[] = [
  { id: "CTR-001", name: "Gabtoli Main Counter", branch: "Dhaka", manager: "Mizanur Rahman", phone: "01700-110011", sales: "৳ 84,500", status: "Active" },
  { id: "CTR-002", name: "Sayedabad Counter", branch: "Dhaka", manager: "Shafiq Ahmed", phone: "01800-220022", sales: "৳ 62,300", status: "Active" },
  { id: "CTR-003", name: "Dampara Counter", branch: "Chattogram", manager: "Nayeem Hasan", phone: "01900-330033", sales: "৳ 48,200", status: "Review" },
];

export const users: RowData[] = [
  { id: "USR-001", name: "Reaz Ahmed", email: "owner@busos.demo", role: "Owner", lastActive: "Just now", status: "Active" },
  { id: "USR-002", name: "Mizanur Rahman", email: "gabtoli@busos.demo", role: "Counter manager", lastActive: "Today", status: "Active" },
  { id: "USR-003", name: "Shafiq Ahmed", email: "sayedabad@busos.demo", role: "Counter agent", lastActive: "Yesterday", status: "Invited" },
];

export const reports: RowData[] = [
  { id: "RPT-001", name: "Daily ticket sales", category: "Revenue", period: "07 Nov 2026", generatedBy: "System", status: "Ready" },
  { id: "RPT-002", name: "Trip performance", category: "Operations", period: "01–07 Nov 2026", generatedBy: "System", status: "Ready" },
  { id: "RPT-003", name: "Fleet utilization", category: "Fleet", period: "October 2026", generatedBy: "System", status: "Ready" },
];

export const pageConfig: Record<string, { title: string; description: string; action: string }> = {
  "Ticket sales": { title: "Ticket sales", description: "Manage reservations, counter sales and passenger tickets.", action: "New booking" },
  "Trips & schedules": { title: "Trips & schedules", description: "Plan departures, assign coaches and monitor trip status.", action: "Create trip" },
  Routes: { title: "Routes", description: "Manage your route network, distance, journey time and fares.", action: "Add route" },
  Passengers: { title: "Passengers", description: "Passenger directory, booking history and customer activity.", action: "Add passenger" },
  Fleet: { title: "Fleet management", description: "Track buses, coach assignments and vehicle availability.", action: "Add vehicle" },
  Finance: { title: "Finance", description: "Monitor revenue, operating costs and settlement activity.", action: "Add transaction" },
  "Live tracking": { title: "Live tracking", description: "Monitor active coaches and their latest reported locations.", action: "Refresh locations" },
  "Crew & staff": { title: "Crew & staff", description: "Manage drivers, conductors, licenses and trip assignments.", action: "Add crew member" },
  Maintenance: { title: "Maintenance", description: "Schedule vehicle inspections, service work and repair history.", action: "Create work order" },
  Inventory: { title: "Inventory", description: "Track spare parts, workshop supplies and reorder levels.", action: "Add inventory item" },
  Counters: { title: "Counters & branches", description: "Manage sales counters, branch contacts and daily performance.", action: "Add counter" },
  "Users & roles": { title: "Users & roles", description: "Manage workspace access and staff role assignments.", action: "Invite user" },
  Reports: { title: "Reports", description: "Review operational, financial and fleet reports.", action: "Export reports" },
};

export const columns: Record<string, Column[]> = {
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
  "Crew & staff": [{ key: "id", label: "Staff ID" }, { key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "phone", label: "Phone" }, { key: "license", label: "License" }, { key: "assigned", label: "Assignment" }, { key: "status", label: "Status" }],
  Maintenance: [{ key: "id", label: "Work order" }, { key: "vehicle", label: "Vehicle" }, { key: "service", label: "Service" }, { key: "due", label: "Due date" }, { key: "workshop", label: "Workshop" }, { key: "cost", label: "Est. cost" }, { key: "status", label: "Status" }],
  Inventory: [{ key: "id", label: "SKU" }, { key: "item", label: "Item" }, { key: "category", label: "Category" }, { key: "stock", label: "Stock" }, { key: "unit", label: "Unit" }, { key: "reorder", label: "Reorder at" }, { key: "status", label: "Status" }],
  Counters: [{ key: "id", label: "Counter ID" }, { key: "name", label: "Counter" }, { key: "branch", label: "Branch" }, { key: "manager", label: "Manager" }, { key: "phone", label: "Phone" }, { key: "sales", label: "Today sales" }, { key: "status", label: "Status" }],
  "Users & roles": [{ key: "id", label: "User ID" }, { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "role", label: "Role" }, { key: "lastActive", label: "Last active" }, { key: "status", label: "Status" }],
  Reports: [{ key: "id", label: "Report ID" }, { key: "name", label: "Report" }, { key: "category", label: "Category" }, { key: "period", label: "Period" }, { key: "generatedBy", label: "Generated by" }, { key: "status", label: "Status" }],
};

export const dataset: Record<string, RowData[]> = {
  "Ticket sales": initialBookings, "Trips & schedules": trips, Routes: routes,
  Passengers: passengers, Fleet: fleet, Finance: finance, "Live tracking": tracking,
  "Crew & staff": crew, Maintenance: maintenance, Inventory: inventory, Counters: counters, "Users & roles": users, Reports: reports,
};

export const salesBars = [38, 54, 46, 68, 52, 78, 62, 88, 70, 95, 74, 84, 66, 100, 82, 91, 72, 86, 63, 78, 57, 73, 49, 67];

export const trackingVehicles = [
  { id: "TR-2048", name: "Green Line · Dhaka–Chattogram", driver: "Rafiqul Islam", speed: 72, eta: "12:05 PM", status: "On route", path: [[23.8103, 90.4125], [23.95, 90.60], [24.05, 90.82], [23.95, 91.05], [23.46, 91.18], [22.95, 91.35], [22.36, 91.80]] },
  { id: "TR-2049", name: "Hanif · Dhaka–Sylhet", driver: "Jamal Uddin", speed: 64, eta: "03:20 PM", status: "On route", path: [[23.8103, 90.4125], [23.95, 90.55], [24.05, 90.75], [24.20, 90.90], [24.45, 91.00], [24.89, 91.87]] },
  { id: "TR-2050", name: "Shyamoli · Dhaka–Rajshahi", driver: "Abdul Karim", speed: 0, eta: "04:10 PM", status: "Stopped", path: [[23.8103, 90.4125], [23.95, 90.20], [24.05, 89.95], [24.15, 89.75], [24.36, 88.60]] },
  { id: "TR-2051", name: "Saintmartin · Chattogram–Cox's Bazar", driver: "Sohel Rana", speed: 48, eta: "02:15 PM", status: "Delayed", path: [[22.3569, 91.7832], [22.30, 91.85], [22.25, 91.90], [22.18, 91.95], [21.95, 92.10], [21.43, 92.00]] },
];
