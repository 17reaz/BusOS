"use client";

import { useEffect, useMemo, useState, CSSProperties } from "react";

type Trip = {
  id: number;
  operator: string;
  type: "AC" | "Non-AC";
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
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
  { id: 1, operator: "Green Line", type: "AC", from: "Dhaka", to: "Chattogram", departure: "07:00 AM", arrival: "01:00 PM", duration: "6h 00m", fare: 1200, booked: ["A1", "A2", "B3", "C4", "D1"] },
  { id: 2, operator: "Hanif Enterprise", type: "Non-AC", from: "Dhaka", to: "Chattogram", departure: "09:30 AM", arrival: "04:00 PM", duration: "6h 30m", fare: 750, booked: ["A3", "B1", "B2", "E4", "F1", "F2", "G3"] },
  { id: 3, operator: "Shyamoli Paribahan", type: "AC", from: "Dhaka", to: "Chattogram", departure: "10:30 PM", arrival: "05:00 AM", duration: "6h 30m", fare: 1400, booked: ["A1", "C1", "C2", "H3", "I4"] },
  { id: 4, operator: "Ena Transport", type: "AC", from: "Dhaka", to: "Sylhet", departure: "08:15 AM", arrival: "02:45 PM", duration: "6h 30m", fare: 1100, booked: ["B1", "B2", "D3", "D4"] },
  { id: 5, operator: "Soudia", type: "AC", from: "Dhaka", to: "Cox's Bazar", departure: "09:00 PM", arrival: "06:30 AM", duration: "9h 30m", fare: 1800, booked: ["A1", "A2", "A3", "A4", "E1", "J4"] },
];

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLS = [1, 2, 3, 4];
const TOTAL_SEATS = ROWS.length * COLS.length;

const C = {
  navy: "#0b1f33",
  navy2: "#14304b",
  primary: "#0f766e",
  primaryDark: "#0b5c56",
  primarySoft: "#e6f4f2",
  accent: "#f59e0b",
  accentSoft: "#fef3d9",
  bg: "#f1f4f8",
  card: "#ffffff",
  line: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  red: "#dc2626",
  redSoft: "#fdecec",
  sold: "#cbd5e1",
};

const font = "'Inter', 'Segoe UI', system-ui, -apple-system, Roboto, Arial, sans-serif";

const s: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: font, fontSize: 14 },
  header: { background: `linear-gradient(90deg, ${C.navy}, ${C.navy2})`, color: "#fff", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(11,31,51,.25)" },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logoBox: { width: 38, height: 38, borderRadius: 10, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: 17, fontWeight: 700, letterSpacing: 0.2 },
  brandSub: { fontSize: 12, color: "#9fb3c8" },
  operator: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#cfdbe8" },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 },
  container: { maxWidth: 1240, margin: "0 auto", padding: "24px 24px 48px", display: "grid", gap: 20 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  stat: { background: C.card, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(15,23,42,.04)" },
  statLabel: { fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: 700, letterSpacing: -0.5 },
  card: { background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 1px 3px rgba(15,23,42,.05)", padding: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, margin: 0 },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10, flexWrap: "wrap" },
  searchRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, alignItems: "end" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: C.muted },
  input: { height: 42, padding: "0 12px", border: `1px solid ${C.line}`, borderRadius: 10, fontSize: 14, background: "#f8fafc", color: C.text, outline: "none", fontFamily: font, width: "100%", boxSizing: "border-box" },
  btn: { height: 42, padding: "0 22px", background: C.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font },
  btnGhost: { height: 40, padding: "0 18px", background: "#fff", color: C.text, border: `1px solid ${C.line}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font },
  layout: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, alignItems: "start" },
  tripCard: { display: "grid", gridTemplateColumns: "1.2fr 1.4fr auto", gap: 14, alignItems: "center", padding: "14px 16px", borderRadius: 12, marginBottom: 12, cursor: "pointer", border: "1.5px solid transparent" },
  pill: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20 },
  timeBig: { fontSize: 17, fontWeight: 700 },
  small: { fontSize: 12, color: C.muted },
  busShell: { width: 270, margin: "0 auto", padding: "16px 16px 18px", border: `2px solid ${C.line}`, borderRadius: "36px 36px 14px 14px", background: "#f8fafc" },
  seatRow: { display: "flex", justifyContent: "center", gap: 8, marginBottom: 9 },
  aisle: { width: 28 },
  legend: { display: "flex", gap: 18, justifyContent: "center", fontSize: 12, color: C.muted, marginTop: 16, flexWrap: "wrap" },
  sumLine: { display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 13.5, gap: 12 },
  sumKey: { color: C.muted },
  totalBox: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: C.primarySoft, borderRadius: 12, marginTop: 10, color: C.primaryDark },
  th: { textAlign: "left", fontSize: 12, color: C.muted, padding: "10px 12px", background: "#f8fafc", fontWeight: 600 },
  td: { fontSize: 13, padding: "12px", borderBottom: `1px solid ${C.line}` },
};

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 26, height: 26, borderRadius: "50%", fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: done ? C.primary : active ? C.navy : "#fff",
          color: done || active ? "#fff" : C.muted,
          border: `1.5px solid ${done ? C.primary : active ? C.navy : C.line}`,
        }}
      >
        {done ? "✓" : n}
      </div>
      <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active || done ? C.text : C.muted }}>{label}</span>
    </div>
  );
}

function seatStyle(state: "free" | "booked" | "selected"): CSSProperties {
  const base: CSSProperties = {
    width: 38, height: 40, borderRadius: "9px 9px 5px 5px", fontSize: 11.5, fontWeight: 700,
    border: `1.5px solid ${C.line}`, borderBottomWidth: 4, background: "#fff", color: C.text,
    cursor: "pointer", fontFamily: font, padding: 0,
  };
  if (state === "booked") return { ...base, background: C.sold, borderColor: C.sold, color: "#64748b", cursor: "not-allowed" };
  if (state === "selected") return { ...base, background: C.accent, borderColor: "#d98a06", color: C.navy };
  return { ...base, borderColor: "#b8c4d2", background: "#fff" };
}

function Barcode({ seed }: { seed: string }) {
  const bars = seed.split("").flatMap((ch, i) => {
    const n = ch.charCodeAt(0);
    return [1 + (n % 3), 1 + ((n + i) % 2)];
  });
  return (
    <div style={{ display: "flex", alignItems: "stretch", height: 44, gap: 2, justifyContent: "center" }}>
      {[...bars, ...bars].map((w, i) => (
        <div key={i} style={{ width: w, background: i % 2 === 0 ? C.navy : "transparent" }} />
      ))}
    </div>
  );
}

export default function CounterBookingPage() {
  const [from, setFrom] = useState("Dhaka");
  const [to, setTo] = useState("Chattogram");
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

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

  const results = useMemo(() => TRIPS.filter((t) => t.from === from && t.to === to), [from, to]);
  const trip = TRIPS.find((t) => t.id === tripId) || null;
  const taken = (id: number, base: string[]) => [...base, ...(soldSeats[id] || [])];

  const subtotal = trip ? trip.fare * selected.length : 0;
  const appliedDiscount = Math.min(discount, subtotal);
  const total = subtotal - appliedDiscount;

  const revenue = history.reduce((a, b) => a + b.total, 0);
  const seatsSold = history.reduce((a, b) => a + b.seats.length, 0);

  const step = ticket ? 4 : name || phone ? 3 : selected.length ? 3 : trip ? 2 : 1;

  function swap() {
    setFrom(to);
    setTo(from);
    setTripId(null);
    setSelected([]);
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
      if (p.includes(code)) {
        setError("");
        return p.filter((x) => x !== code);
      }
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
      {/* Header */}
      <header style={s.header}>
        <div style={s.brand}>
          <div style={s.logoBox}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="13" rx="3" />
              <path d="M3 11h18M7 17v2M17 17v2" />
              <circle cx="7.5" cy="14" r=".6" fill={C.navy} />
              <circle cx="16.5" cy="14" r=".6" fill={C.navy} />
            </svg>
          </div>
          <div>
            <div style={s.brandName}>BusDesk</div>
            <div style={s.brandSub}>Counter booking system</div>
          </div>
        </div>
        <div style={s.operator}>
          <span>Kallyanpur Counter</span>
          <div style={s.avatar}>K</div>
        </div>
      </header>

      <main style={s.container}>
        {/* Stats */}
        <section style={s.stats}>
          <div style={s.stat}>
            <div style={s.statLabel}>Tickets sold today</div>
            <div style={s.statValue}>{history.length}</div>
          </div>
          <div style={s.stat}>
            <div style={s.statLabel}>Seats sold</div>
            <div style={s.statValue}>{seatsSold}</div>
          </div>
          <div style={s.stat}>
            <div style={s.statLabel}>Total collection</div>
            <div style={{ ...s.statValue, color: C.primary }}>৳ {revenue.toLocaleString()}</div>
          </div>
        </section>

        {/* Stepper */}
        <section style={{ ...s.card, padding: "14px 20px", display: "flex", gap: 28, flexWrap: "wrap" }}>
          <StepDot n={1} label="Select trip" active={step === 1} done={step > 1} />
          <StepDot n={2} label="Choose seats" active={step === 2} done={step > 2} />
          <StepDot n={3} label="Passenger & payment" active={step === 3} done={step > 3} />
          <StepDot n={4} label="Ticket issued" active={step === 4} done={false} />
        </section>

        {/* Search */}
        <section style={s.card}>
          <div style={s.cardHead}>
            <h2 style={s.cardTitle}>Search trips</h2>
          </div>
          <div style={s.searchRow}>
            <div style={s.field}>
              <label style={s.label}>From</label>
              <select style={s.input} value={from} onChange={(e) => { setFrom(e.target.value); setTripId(null); setSelected([]); }}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>To</label>
              <select style={s.input} value={to} onChange={(e) => { setTo(e.target.value); setTripId(null); setSelected([]); }}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.field}>
              <label style={s.label}>Journey date</label>
              <input style={s.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <button style={s.btnGhost} onClick={swap}>⇄ Swap route</button>
          </div>
        </section>

        <div style={s.layout}>
          {/* Left: trips + seats */}
          <div style={{ display: "grid", gap: 20 }}>
            <section style={s.card}>
              <div style={s.cardHead}>
                <h2 style={s.cardTitle}>Available trips</h2>
                <span style={s.small}>{from} → {to} · {results.length} found</span>
              </div>

              {results.length === 0 && (
                <div style={{ padding: "28px 0", textAlign: "center", color: C.muted }}>
                  No trips on this route. Try Dhaka to Chattogram, Sylhet or Cox's Bazar.
                </div>
              )}

              {results.map((t) => {
                const left = TOTAL_SEATS - taken(t.id, t.booked).length;
                const active = t.id === tripId;
                const low = left <= 8;
                return (
                  <div
                    key={t.id}
                    onClick={() => pickTrip(t.id)}
                    style={{
                      ...s.tripCard,
                      background: active ? C.primarySoft : "#f8fafc",
                      borderColor: active ? C.primary : "transparent",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{t.operator}</div>
                      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ ...s.pill, background: t.type === "AC" ? "#e0f2fe" : "#f1f5f9", color: t.type === "AC" ? "#0369a1" : C.muted }}>{t.type}</span>
                        <span style={{ ...s.pill, background: low ? C.redSoft : C.accentSoft, color: low ? C.red : "#b45309" }}>{left} seats left</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div>
                        <div style={s.timeBig}>{t.departure}</div>
                        <div style={s.small}>{t.from}</div>
                      </div>
                      <div style={{ textAlign: "center", minWidth: 60 }}>
                        <div style={{ ...s.small, fontSize: 11 }}>{t.duration}</div>
                        <div style={{ height: 2, background: C.line, margin: "4px 0", position: "relative" }}>
                          <div style={{ position: "absolute", right: -1, top: -3, width: 8, height: 8, borderRadius: "50%", background: C.primary }} />
                        </div>
                      </div>
                      <div>
                        <div style={s.timeBig}>{t.arrival}</div>
                        <div style={s.small}>{t.to}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>৳ {t.fare}</div>
                      <div style={s.small}>per seat</div>
                    </div>
                  </div>
                );
              })}
            </section>

            {trip && (
              <section style={s.card}>
                <div style={s.cardHead}>
                  <h2 style={s.cardTitle}>Seat selection · {trip.operator}</h2>
                  <span style={s.small}>Up to 4 seats</span>
                </div>
                <div style={s.busShell}>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14, paddingRight: 6 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M12 14v7M3.5 10.5 10 12M20.5 10.5 14 12" />
                    </svg>
                  </div>
                  {ROWS.map((r) => (
                    <div key={r} style={s.seatRow}>
                      {COLS.map((c) => {
                        const code = `${r}${c}`;
                        const isBooked = taken(trip.id, trip.booked).includes(code);
                        const state = isBooked ? "booked" : selected.includes(code) ? "selected" : "free";
                        return (
                          <span key={code} style={{ display: "flex" }}>
                            {c === 3 && <span style={s.aisle} />}
                            <button style={seatStyle(state)} onClick={() => toggleSeat(code, isBooked)} disabled={isBooked} title={isBooked ? "Sold" : `Seat ${code}`}>
                              {code}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div style={s.legend}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 14, height: 14, borderRadius: 4, border: "1.5px solid #b8c4d2", display: "inline-block" }} />Available</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 14, height: 14, borderRadius: 4, background: C.accent, display: "inline-block" }} />Selected</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 14, height: 14, borderRadius: 4, background: C.sold, display: "inline-block" }} />Sold</span>
                </div>
              </section>
            )}
          </div>

          {/* Right: booking panel */}
          <div style={{ display: "grid", gap: 20, position: "sticky", top: 16 }}>
            <section style={s.card}>
              <div style={s.cardHead}>
                <h2 style={s.cardTitle}>Passenger details</h2>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div style={s.field}>
                  <label style={s.label}>Passenger name</label>
                  <input style={s.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahim Uddin" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Mobile number</label>
                  <input style={s.input} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01XXXXXXXXX" inputMode="numeric" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={s.field}>
                    <label style={s.label}>Boarding point</label>
                    <select style={s.input} value={boarding} onChange={(e) => setBoarding(e.target.value)}>
                      {BOARDING.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Discount (৳)</label>
                    <input style={s.input} type="number" min={0} value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))} />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Payment method</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {["Cash", "bKash", "Nagad", "Card"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPayment(p)}
                        style={{
                          height: 38, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font,
                          border: `1.5px solid ${payment === p ? C.primary : C.line}`,
                          background: payment === p ? C.primarySoft : "#fff",
                          color: payment === p ? C.primaryDark : C.text,
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px dashed ${C.line}` }}>
                <div style={s.sumLine}><span style={s.sumKey}>Trip</span><span style={{ fontWeight: 600, textAlign: "right" }}>{trip ? `${trip.operator} · ${trip.departure}` : "—"}</span></div>
                <div style={s.sumLine}><span style={s.sumKey}>Seats</span><span style={{ fontWeight: 600 }}>{selected.length ? [...selected].sort().join(", ") : "—"}</span></div>
                <div style={s.sumLine}><span style={s.sumKey}>Subtotal</span><span>৳ {subtotal.toLocaleString()}</span></div>
                <div style={s.sumLine}><span style={s.sumKey}>Discount</span><span>− ৳ {appliedDiscount.toLocaleString()}</span></div>
                <div style={s.totalBox}>
                  <span style={{ fontWeight: 600 }}>Total payable</span>
                  <span style={{ fontSize: 24, fontWeight: 800 }}>৳ {total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 12, padding: "10px 12px", background: C.redSoft, color: C.red, borderRadius: 10, fontSize: 13, fontWeight: 500 }}>
                  {error}
                </div>
              )}
              <button style={{ ...s.btn, width: "100%", height: 46, marginTop: 14, fontSize: 15 }} onClick={confirm}>
                Confirm & issue ticket
              </button>
            </section>

            {ticket && (
              <section style={{ position: "relative", background: "#fff", borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 6px 20px rgba(15,23,42,.08)", overflow: "hidden" }}>
                <div style={{ background: C.navy, color: "#fff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#9fb3c8" }}>Ticket no.</div>
                    <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>{ticket.no}</div>
                  </div>
                  <span style={{ ...s.pill, background: "#d1fae5", color: "#047857" }}>Confirmed</span>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{ticket.trip.from}</div>
                      <div style={s.small}>{ticket.trip.departure}</div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 20 }}>→</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{ticket.trip.to}</div>
                      <div style={s.small}>{ticket.trip.arrival}</div>
                    </div>
                  </div>
                  <div style={s.sumLine}><span style={s.sumKey}>Passenger</span><span style={{ fontWeight: 600 }}>{ticket.name}</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Mobile</span><span>{ticket.phone}</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Bus</span><span>{ticket.trip.operator} ({ticket.trip.type})</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Journey date</span><span>{ticket.date}</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Seats</span><span style={{ fontWeight: 700 }}>{ticket.seats.join(", ")}</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Boarding</span><span>{ticket.boarding}</span></div>
                  <div style={s.sumLine}><span style={s.sumKey}>Paid via {ticket.payment}</span><span style={{ fontWeight: 700 }}>৳ {ticket.total.toLocaleString()}</span></div>
                </div>
                <div style={{ position: "relative", borderTop: `2px dashed ${C.line}`, padding: "16px 20px 18px" }}>
                  <span style={{ position: "absolute", left: -10, top: -11, width: 20, height: 20, borderRadius: "50%", background: C.bg }} />
                  <span style={{ position: "absolute", right: -10, top: -11, width: 20, height: 20, borderRadius: "50%", background: C.bg }} />
                  <Barcode seed={ticket.no} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <span style={s.small}>{ticket.at}</span>
                    <button style={s.btnGhost} onClick={() => window.print()}>Print</button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sales table */}
        <section style={s.card}>
          <div style={s.cardHead}>
            <h2 style={s.cardTitle}>Today's sales</h2>
            <span style={s.small}>{history.length} tickets</span>
          </div>
          {history.length === 0 ? (
            <div style={{ padding: "24px 0", textAlign: "center", color: C.muted }}>No tickets sold yet. Issued tickets will appear here.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr>
                    {["Ticket", "Passenger", "Route", "Seats", "Payment", "Amount"].map((h, i) => (
                      <th key={h} style={{ ...s.th, textAlign: i === 5 ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.no}>
                      <td style={{ ...s.td, fontWeight: 600 }}>{h.no}</td>
                      <td style={s.td}>{h.name}</td>
                      <td style={s.td}>{h.trip.from} → {h.trip.to}</td>
                      <td style={s.td}>{h.seats.join(", ")}</td>
                      <td style={s.td}>{h.payment}</td>
                      <td style={{ ...s.td, textAlign: "right", fontWeight: 600 }}>৳ {h.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ ...s.td, fontWeight: 700, borderBottom: "none" }} colSpan={5}>Total collection</td>
                    <td style={{ ...s.td, fontWeight: 800, textAlign: "right", borderBottom: "none", color: C.primary }}>৳ {revenue.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
