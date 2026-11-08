import { Activity, Bus, CalendarDays, LayoutDashboard, MapPinned, Ticket, Users, Wallet } from "lucide-react";

export type RowData = Record<string, string>;
export type Column = { key: string; label: string; className?: string };

export const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Ticket sales", icon: Ticket, count: "24" },
  { label: "Trips & schedules", icon: CalendarDays },
  { label: "Routes", icon: MapPinned },
  { label: "Passengers", icon: Users },
];
export const operations = [
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

export const salesBars = [38, 54, 46, 68, 52, 78, 62, 88, 70, 95, 74, 84, 66, 100, 82, 91, 72, 86, 63, 78, 57, 73, 49, 67];

export const trackingVehicles = [
  { id: "TR-2048", name: "Green Line · Dhaka–Chattogram", driver: "Rafiqul Islam", speed: 72, eta: "12:05 PM", status: "On route", path: [[23.8103, 90.4125], [23.95, 90.60], [24.05, 90.82], [23.95, 91.05], [23.46, 91.18], [22.95, 91.35], [22.36, 91.80]] },
  { id: "TR-2049", name: "Hanif · Dhaka–Sylhet", driver: "Jamal Uddin", speed: 64, eta: "03:20 PM", status: "On route", path: [[23.8103, 90.4125], [23.95, 90.55], [24.05, 90.75], [24.20, 90.90], [24.45, 91.00], [24.89, 91.87]] },
  { id: "TR-2050", name: "Shyamoli · Dhaka–Rajshahi", driver: "Abdul Karim", speed: 0, eta: "04:10 PM", status: "Stopped", path: [[23.8103, 90.4125], [23.95, 90.20], [24.05, 89.95], [24.15, 89.75], [24.36, 88.60]] },
  { id: "TR-2051", name: "Saintmartin · Chattogram–Cox's Bazar", driver: "Sohel Rana", speed: 48, eta: "02:15 PM", status: "Delayed", path: [[22.3569, 91.7832], [22.30, 91.85], [22.25, 91.90], [22.18, 91.95], [21.95, 92.10], [21.43, 92.00]] },
];
