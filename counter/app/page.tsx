"use client";

import { useMemo, useState, CSSProperties } from "react";

type Trip = {
  id: number;
  operator: string;
  type: "AC" | "Non-AC";
  from: string;
  to: string;
  departure: string;
  fare: number;
  booked: string[];
};

type Ticket = {
  no: string;
  trip: Trip;
  seats: string[];
  name: string;
  phone: string;
  boarding: string;
  payment: string;
  total: number;
  date: string;
  at: string;
};

const CITIES = ["Dhaka", "Chattogram", "Cox's Bazar", "Sylhet", "Rajshahi", "Khulna"];
const BOARDING = ["Kallyanpur", "Gabtoli", "Sayedabad", "Mohakhali", "Abdullahpur"];

const TRIPS: Trip[] = [
  { id: 1, operator: "Green Line", type: "AC", from: "Dhaka", to: "Chattogram", departure: "07:00 AM", fare: 1200, booked: ["A1", "A2", "B3", "C4", "D1"] },
  { id: 2, operator: "Hanif Enterprise", type: "Non-AC", from: "Dhaka", to: "Chattogram", departure: "09:30 AM", fare: 750, booked: ["A3", "B1", "B2", "E4", "F1", "F2", "G3"] },
  { id: 3, operator: "Shyamoli Paribahan", type: "AC", from: "Dhaka", to: "Chattogram", departure: "10:30 PM", fare: 1400, booked: ["A1", "C1", "C2", "H3", "I4"] },
  { id: 4, operator: "Ena Transport", type: "AC", from: "Dhaka", to: "Sylhet", departure: "08:15 AM", fare: 1100, booked: ["B1", "B2", "D3", "D4"] },
  { id: 5, operator: "Soudia", type: "AC", from: "Dhaka", to: "Cox's Bazar", departure: "09:00 PM", fare: 1800, booked: ["A1", "A2", "A3", "A4", "E1", "J4"] },
];

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = [1, 2, 3, 4];

const C = {
  ink: "#12283a",
  teal: "#0f766e",
  tealSoft: "#d9efec",
  amber: "#f2a516",
  line: "#d5dde3",
  bg: "#f3f6f8",
  white: "#ffffff",
  red: "#c0392b",
  muted: "#5f7282",
};

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" },
  header: { background: C.ink, color: C.white, padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: 0.3 },
  sub: { fontSize: 13, opacity: 0.75 },
  wrap: { maxWidth: 1180, margin: "0 auto", padding: 20, display: "grid", gap: 20 },
  card: { background: C.white, border: `1px solid ${C.line}`, borderRadius: 10, padding: 18 },
  h2: { fontSize: 16, fontWeight: 700, margin: "0 0 14px" },
  row: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", gap: 5, flex: "1 1 160px" },
  label: { fontSize: 12, color: C.muted, fontWeight: 600 },
  input: { padding: "10px 12px", border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 14, background: C.white, color: C.ink, outline: "none" },
  btn: { padding: "11px 20px", background: C.teal, color: C.white, border: "none", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnGhost: { padding: "11px 20px", background: C.white, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  split: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" },
  tripRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 14px", border: `1px solid ${C.line}`, borderRadius: 8, marginBottom: 10, cursor: "pointer", flexWrap: "wrap" },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: C.tealSoft, color: C.teal, marginLeft: 8 },
  bus: { border: `2px solid ${C.line}`, borderRadius: 14, padding: 14, maxWidth: 280, margin: "0 auto", background: "#fafcfd" },
  seatRow: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 8 },
  aisle: { width: 26 },
  legend: { display: "flex", gap: 14, justifyContent: "center", fontSize: 12, color: C.muted, marginTop: 12, flexWrap: "wrap" },
  summaryLine: { display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0" },
  total: { display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, padding: "12px 0 4px", borderTop: `1px dashed ${C.line}`, marginTop: 8 },
  th: { textAlign: "left", fontSize: 12, color: C.muted, padding: "8px 10px", borderBottom: `1px solid ${C.line}` },
  td: { fontSize: 13, padding: "9px 10px", borderBottom: `1px solid ${C.line}` },
  ticket: { border: `2px dashed ${C.teal}`, borderRadius: 10, padding: 18, background: "#f7fcfb" },
};

function seatStyle(state: "free" | "booked" | "selected"): CSSProperties {
  const base: CSSProperties = {
    width: 40, height: 36, borderRadius: 6, fontSize: 12, fontWeight: 700,
    border: `1.5px solid ${C.line}`, background: C.white, color: C.ink, cursor: "pointer",
  };
  if (state === "booked") return { ...base, background: "#e4e8eb", color: "#9aa7b1", cursor: "not-allowed", borderColor: "#e4e8eb" };
  if (state === "selected") return { ...base, background: C.amber, borderColor: C.amber, color: C.ink };
  return base;
}

export default function CounterBookingPage() {
  const [from, setFrom] = useState("Dhaka");
  const [to, setTo] = useState("Chattogram");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [searched, setSearched] = useState(true);
  const [tripId, setTripId] = useState<number | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [soldSeats, setSoldSeats] = useState<Record<number, string[]>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [boarding, setBoarding] = useState(BOARDING[0]);
  const [payment, setPayment] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [history, setHistory] = useState<Ticket[]>([]);

  const results = useMemo(
    () => (searched ? TRIPS.filter((t) => t.from === from && t.to === to) : []),
    [searched, from, to]
  );
  const trip = TRIPS.find((t) => t.id === tripId) || null;
  const taken = (id: number, base: string[]) => [...base, ...(soldSeats[id] || [])];

  const subtotal = trip ? trip.fare * selected.length : 0;
  const total = Math.max(subtotal - discount, 0);

  function search() {
    setSearched(true);
    setTripId(null);
    setSelected([]);
    setTicket(null);
  }

  function pickTrip(id: number) {
    setTripId(id);
    setSelected([]);
    setTicket(null);
    setError("");
  }

  function toggleSeat(code: string, isBooked: boolean) {
    if (isBooked) return;
    setSelected((p) => {
      if (p.includes(code)) return p.filter((x) => x !== code);
      if (p.length >= 4) {
        setError("Maximum 4 seats per booking.");
        return p;
      }
      setError("");
      return [...p, code];
    });
  }

  function confirm() {
    if (!trip) return setError("Select a trip first.");
    if (selected.length === 0) return setError("Select at least one seat.");
    if (!name.trim()) return setError("Enter the passenger name.");
    if (!/^01[3-9]\d{8}$/.test(phone)) return setError("Enter a valid mobile number (01XXXXXXXXX).");

    const t: Ticket = {
      no: "TK" + String(Date.now()).slice(-7),
      trip,
      seats: [...selected].sort(),
      name: name.trim(),
      phone,
      boarding,
      payment,
      total,
      date,
      at: new Date().toLocaleString(),
    };
    setSoldSeats((p) => ({ ...p, [trip.id]: [...(p[trip.id] || []), ...selected] }));
    setHistory((h) => [t, ...h]);
    setTicket(t);
    setSelected([]);
    setName("");
    setPhone("");
    setDiscount(0);
    setError("");
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.logo}>Bus Counter Booking</div>
          <div style={s.sub}>Counter: Kallyanpur, Dhaka</div>
        </div>
        <div style={s.sub}>Sold today: {history.length} tickets</div>
      </div>

      <div style={s.wrap}>
        {/* Search */}
        <div style={s.card}>
          <h2 style={s.h2}>Find a trip</h2>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>From</label>
              <select style={s.input} value={from} onChange={(e) => setFrom(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>To</label>
              <select style={s.input} value={to} onChange={(e) => setTo(e.target.value)}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Journey date</label>
              <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button style={s.btn} onClick={search}>Search trips</button>
          </div>
        </div>

        <div style={s.split}>
          {/* Trips + seats */}
          <div style={s.card}>
            <h2 style={s.h2}>Available trips</h2>
            {results.length === 0 && <div style={{ color: C.muted, fontSize: 14 }}>No trips for this route. Try Dhaka to Chattogram, Sylhet or Cox's Bazar.</div>}
            {results.map((t) => {
              const left = ROWS.length * COLS.length - taken(t.id, t.booked).length;
              const active = t.id === tripId;
              return (
                <div
                  key={t.id}
                  onClick={() => pickTrip(t.id)}
                  style={{ ...s.tripRow, borderColor: active ? C.teal : C.line, background: active ? "#f1faf9" : C.white }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.operator}<span style={s.badge}>{t.type}</span></div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>Departs {t.departure} · {left} seats left</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>৳ {t.fare}</div>
                </div>
              );
            })}

            {trip && (
              <div style={{ marginTop: 18 }}>
                <h2 style={s.h2}>Choose seats</h2>
                <div style={s.bus}>
                  <div style={{ textAlign: "right", fontSize: 12, color: C.muted, marginBottom: 10 }}>Driver ⛯</div>
                  {ROWS.map((r) => (
                    <div key={r} style={s.seatRow}>
                      {COLS.map((c) => {
                        const code = `${r}${c}`;
                        const isBooked = taken(trip.id, trip.booked).includes(code);
                        const state = isBooked ? "booked" : selected.includes(code) ? "selected" : "free";
                        return (
                          <span key={code} style={{ display: "flex" }}>
                            {c === 3 && <span style={s.aisle} />}
                            <button style={seatStyle(state)} onClick={() => toggleSeat(code, isBooked)} disabled={isBooked}>
                              {code}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div style={s.legend}>
                  <span>⬜ Available</span>
                  <span style={{ color: "#b97b00" }}>🟧 Selected</span>
                  <span>⬛ Sold</span>
                </div>
              </div>
            )}
          </div>

          {/* Passenger + summary */}
          <div style={{ display: "grid", gap: 20 }}>
            <div style={s.card}>
              <h2 style={s.h2}>Passenger details</h2>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={s.field}>
                  <label style={s.label}>Passenger name</label>
                  <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahim Uddin" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Mobile number</label>
                  <input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01XXXXXXXXX" />
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Boarding point</label>
                    <select style={s.input} value={boarding} onChange={(e) => setBoarding(e.target.value)}>
                      {BOARDING.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Payment</label>
                    <select style={s.input} value={payment} onChange={(e) => setPayment(e.target.value)}>
                      {["Cash", "bKash", "Nagad", "Card"].map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Discount (৳)</label>
                  <input style={s.input} type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))} />
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={s.summaryLine}><span>Trip</span><span>{trip ? `${trip.operator} · ${trip.departure}` : "—"}</span></div>
                <div style={s.summaryLine}><span>Seats</span><span>{selected.length ? [...selected].sort().join(", ") : "—"}</span></div>
                <div style={s.summaryLine}><span>Subtotal</span><span>৳ {subtotal}</span></div>
                <div style={s.summaryLine}><span>Discount</span><span>− ৳ {Math.min(discount, subtotal)}</span></div>
                <div style={s.total}><span>Total</span><span>৳ {total}</span></div>
              </div>

              {error && <div style={{ color: C.red, fontSize: 13, marginTop: 10 }}>{error}</div>}
              <button style={{ ...s.btn, width: "100%", marginTop: 14 }} onClick={confirm}>Confirm booking</button>
            </div>

            {ticket && (
              <div style={s.ticket}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: 8 }}>
                  <span>Ticket {ticket.no}</span>
                  <span style={{ color: C.teal }}>Booked</span>
                </div>
                <div style={s.summaryLine}><span>Passenger</span><span>{ticket.name} ({ticket.phone})</span></div>
                <div style={s.summaryLine}><span>Route</span><span>{ticket.trip.from} → {ticket.trip.to}</span></div>
                <div style={s.summaryLine}><span>Bus</span><span>{ticket.trip.operator} ({ticket.trip.type})</span></div>
                <div style={s.summaryLine}><span>Journey</span><span>{ticket.date}, {ticket.trip.departure}</span></div>
                <div style={s.summaryLine}><span>Seats</span><span>{ticket.seats.join(", ")}</span></div>
                <div style={s.summaryLine}><span>Boarding</span><span>{ticket.boarding}</span></div>
                <div style={s.summaryLine}><span>Paid by {ticket.payment}</span><span style={{ fontWeight: 700 }}>৳ {ticket.total}</span></div>
                <button style={{ ...s.btnGhost, marginTop: 10 }} onClick={() => window.print()}>Print ticket</button>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div style={s.card}>
          <h2 style={s.h2}>Today's sales</h2>
          {history.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 14 }}>No tickets sold yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Ticket", "Passenger", "Route", "Seats", "Payment", "Amount"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.no}>
                      <td style={s.td}>{h.no}</td>
                      <td style={s.td}>{h.name}</td>
                      <td style={s.td}>{h.trip.from} → {h.trip.to}</td>
                      <td style={s.td}>{h.seats.join(", ")}</td>
                      <td style={s.td}>{h.payment}</td>
                      <td style={s.td}>৳ {h.total}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ ...s.td, fontWeight: 700 }} colSpan={5}>Total collection</td>
                    <td style={{ ...s.td, fontWeight: 700 }}>৳ {history.reduce((a, b) => a + b.total, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
