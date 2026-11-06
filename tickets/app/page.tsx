"use client";

import { memo, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowLeftRight, Banknote, Bus, CalendarDays, Check, CreditCard,
  Phone, Printer, Search, Smartphone, Ticket as TicketIcon, User, Users, X,
} from "lucide-react";

/* ───────────── Types ───────────── */
type BusType = "AC" | "Non-AC" | "Sleeper";
type Gender = "Male" | "Female" | "Other";
type BusT = { id: string; op: string; type: BusType; dep: number; dur: number; price: number; from: string; to: string; fromSt: string; toSt: string; booked: string[] };
type Pax = { name: string; mobile: string; gender: Gender | ""; email: string };
type Search = { from: string; to: string; date: string; pax: number };
type Booking = { id: string; ref: string; bus: BusT; search: Search; seats: string[]; pax: Pax[]; fare: number; service: number; total: number; pay: string; at: string };
type Errs = Record<string, Partial<Record<keyof Pax, string>>>;

/* ───────────── Mock data ───────────── */
const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Cox's Bazar", "Rajshahi", "Khulna"];
const KM: Record<string, number> = { Dhaka: 0, Chittagong: 250, Sylhet: 240, "Cox's Bazar": 400, Rajshahi: 260, Khulna: 270 };
const TERMINALS: Record<string, string[]> = {
  Dhaka: ["Kallyanpur", "Sayedabad", "Fakirapool"], Chittagong: ["AK Khan", "Dampara", "Bahaddarhat"],
  Sylhet: ["Kadamtoli", "Bandar Bazar"], "Cox's Bazar": ["Kolatoli", "Link Road"],
  Rajshahi: ["Shiroil", "Nowdapara"], Khulna: ["Sonadanga", "Fulbari"],
};
const OPERATORS: { n: string; type: BusType; h: number; m: number }[] = [
  { n: "Green Line", type: "AC", h: 6, m: 30 }, { n: "Hanif Enterprise", type: "Non-AC", h: 7, m: 15 },
  { n: "Shyamoli Paribahan", type: "AC", h: 9, m: 0 }, { n: "Ena Transport", type: "AC", h: 13, m: 30 },
  { n: "Soudia Coach", type: "Non-AC", h: 15, m: 45 }, { n: "S.R. Travels", type: "Sleeper", h: 21, m: 0 },
  { n: "National Travels", type: "AC", h: 23, m: 0 },
];
const RATE: Record<BusType, number> = { AC: 2.4, "Non-AC": 1.6, Sleeper: 3.4 };
const SEATS = "ABCDEFGHIJ".split("").flatMap((r) => [1, 2, 3, 4].map((n) => `${r}${n}`));
const LADIES = new Set(["A1", "A2", "B1", "B2"]);
const SERVICE = 20;
const PAYMENTS = [
  { id: "cash", label: "Cash at counter", hint: "Collect at the counter", Icon: Banknote },
  { id: "bkash", label: "bKash", hint: "Demo only, no charge", Icon: Smartphone },
  { id: "nagad", label: "Nagad", hint: "Demo only, no charge", Icon: Smartphone },
  { id: "card", label: "Card", hint: "Demo only, no charge", Icon: CreditCard },
];
const POPULAR: [string, string][] = [["Dhaka", "Chittagong"], ["Dhaka", "Sylhet"], ["Dhaka", "Cox's Bazar"], ["Dhaka", "Rajshahi"], ["Dhaka", "Khulna"], ["Chittagong", "Cox's Bazar"]];
const SUPPORT = "Hotline 09638-000-000 · support@busos.demo";

/* ───────────── Helpers ───────────── */
const money = (n: number) => `৳${n.toLocaleString("en-US")}`;
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const fmtDate = (s: string) => !s ? "" : new Date(`${s}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
const t12 = (m: number) => { const x = ((m % 1440) + 1440) % 1440, h = Math.floor(x / 60); return `${String(h % 12 || 12).padStart(2, "0")}:${String(x % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const hm = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
const sortSeats = (s: string[]) => [...s].sort((a, b) => SEATS.indexOf(a) - SEATS.indexOf(b));
const blank: Pax = { name: "", mobile: "", gender: "", email: "" };

function rng(seed: string) {
  let s = 2166136261;
  for (const c of seed) { s ^= c.charCodeAt(0); s = Math.imul(s, 16777619); }
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; };
}

function buildBuses({ from, to, date }: Search): BusT[] {
  const km = from === "Dhaka" || to === "Dhaka" ? KM[from] + KM[to] : Math.max(120, Math.abs(KM[from] - KM[to]) + 80);
  return OPERATORS.map((o, i) => {
    const r = rng(`${from}${to}${date}${i}`);
    const a = TERMINALS[from], b = TERMINALS[to];
    return {
      id: `${i}-${from}-${to}-${date}`, op: o.n, type: o.type, dep: o.h * 60 + o.m,
      dur: Math.round(((km / (o.type === "AC" ? 40 : 35)) * 60) / 5) * 5,
      price: Math.round((km * RATE[o.type]) / 10) * 10, from, to,
      fromSt: a[i % a.length], toSt: b[i % b.length],
      booked: SEATS.filter(() => r() < 0.28 + i * 0.05),
    };
  });
}

/* ───────────── Styles ───────────── */
const inp = "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 aria-[invalid=true]:border-red-500";
const lbl = "mb-1 block text-xs font-medium text-slate-600";
const btn = "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300";
const btnGhost = "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600";
const badge: Record<BusType, string> = { AC: "bg-blue-50 text-blue-700", "Non-AC": "bg-slate-100 text-slate-600", Sleeper: "bg-indigo-50 text-indigo-700" };

const PRINT_CSS = `
@page{size:80mm auto;margin:0}
@media print{
  html,body{background:#fff!important;margin:0!important}
  .no-print{display:none!important}
  .pmod{position:static!important;display:block!important;overflow:visible!important;max-height:none!important;height:auto!important;background:none!important;padding:0!important;box-shadow:none!important;border:0!important;border-radius:0!important}
  .ticket{width:72mm!important;margin:0 auto!important;padding:3mm 0!important;border:0!important;box-shadow:none!important;background:#fff!important;color:#000!important;break-after:page;page-break-after:always}
  .ticket:last-child{break-after:auto;page-break-after:auto}
  .ticket *{color:#000!important;background:transparent!important;border-color:#000!important}
}`;

/* ───────────── Demo QR (decorative, not scannable) ───────────── */
function QR({ value, size = 96 }: { value: string; size?: number }) {
  const N = 25;
  const cells = useMemo(() => {
    const r = rng(value), out: [number, number][] = [];
    const corners = [[0, 0], [N - 7, 0], [0, N - 7]];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      let on = r() > 0.5;
      for (const [a, b] of corners) {
        const lx = x - a, ly = y - b;
        if (lx >= -1 && lx <= 7 && ly >= -1 && ly <= 7)
          on = lx >= 0 && lx < 7 && ly >= 0 && ly < 7 && (lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx > 1 && lx < 5 && ly > 1 && ly < 5));
      }
      if (on) out.push([x, y]);
    }
    return out;
  }, [value]);
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${N + 2} ${N + 2}`} shapeRendering="crispEdges" role="img" aria-label="Demo QR code">
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#fff" />
      {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#000" />)}
    </svg>
  );
}

/* ───────────── 80mm thermal ticket ───────────── */
const R = ({ k, v, b }: { k: string; v: string; b?: boolean }) => (
  <div className={`flex justify-between gap-2 ${b ? "font-bold" : ""}`}><span>{k}</span><span className="text-right">{v}</span></div>
);

function Ticket({ b, i }: { b: Booking; i: number }) {
  const seat = b.seats[i], p = b.pax[i], tid = `${b.id}-${i + 1}`;
  const pay = PAYMENTS.find((x) => x.id === b.pay)?.label ?? b.pay;
  const hr = <hr className="my-2 border-dashed border-black" />;
  return (
    <div className="ticket mx-auto mb-4 w-[302px] border border-slate-300 bg-white p-3 font-mono text-[11px] leading-snug text-black shadow-sm">
      <div className="text-center"><p className="text-xl font-black tracking-wide">BusOS</p><p>Bus Ticket · Bangladesh</p></div>
      {hr}
      <R k="Ticket ID" v={tid} /><R k="Booking Ref" v={b.ref} /><R k="Issued" v={b.at} />
      {hr}
      <R k="Passenger" v={p.name} /><R k="Mobile" v={p.mobile} />
      {hr}
      <R k="Route" v={`${b.search.from} - ${b.search.to}`} /><R k="Date" v={fmtDate(b.search.date)} />
      <R k="Departure" v={t12(b.bus.dep)} /><R k="Boarding" v={b.bus.fromSt} /><R k="Operator" v={`${b.bus.op} (${b.bus.type})`} />
      <p className="my-2 border-y-2 border-black py-1 text-center text-2xl font-black">SEAT {seat}</p>
      <R k="Ticket fare" v={money(b.bus.price)} /><R k="Service charge" v={money(SERVICE)} /><R k="TOTAL" v={money(b.bus.price + SERVICE)} b />
      {hr}
      <R k="Payment" v={pay} /><R k="Status" v="PAID" b />
      <div className="mt-2 flex flex-col items-center gap-1"><QR value={tid} size={92} /><p>{tid}</p></div>
      {hr}
      <div className="text-center"><p>{SUPPORT}</p><p>Be at the counter 30 min before departure.</p><p className="mt-1 font-bold">*** DEMO TICKET · NOT VALID FOR TRAVEL ***</p></div>
    </div>
  );
}

/* ───────────── Modal shell ───────────── */
function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="pmod fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={label}>
      <div className="pmod flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-xl">{children}</div>
    </div>
  );
}

/* ───────────── Seat map ───────────── */
function SeatMap({ bus, selected, onToggle }: { bus: BusT; selected: string[]; onToggle: (s: string) => void }) {
  const seat = (s: string) => {
    const booked = bus.booked.includes(s), sel = selected.includes(s), ladies = LADIES.has(s);
    const cls = booked ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400"
      : sel ? "border-blue-600 bg-blue-600 text-white"
      : ladies ? "border-pink-300 bg-pink-50 text-pink-700 hover:border-pink-500"
      : "border-slate-300 bg-white text-slate-700 hover:border-blue-500";
    return (
      <button key={s} type="button" disabled={booked} aria-pressed={sel}
        aria-label={`Seat ${s}${ladies ? ", ladies only" : ""}${booked ? ", booked" : sel ? ", selected" : ", available"}`}
        onClick={() => onToggle(s)}
        className={`h-10 w-full max-w-[44px] justify-self-center rounded-b-sm rounded-t-lg border-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-600 ${cls}`}>{s}</button>
    );
  };
  const rows = SEATS.length / 4;
  return (
    <div>
      <div className="mx-auto w-full max-w-[280px] rounded-t-[40px] rounded-b-lg border-2 border-slate-300 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
          <span className="text-[11px] text-slate-400">Door</span>
          <div className="grid h-10 w-14 place-items-center rounded-md bg-slate-800 text-[10px] font-medium text-white">Driver</div>
        </div>
        <div className="grid grid-cols-[1fr_1fr_20px_1fr_1fr] gap-x-2 gap-y-2">
          {Array.from({ length: rows }, (_, r) => {
            const [a, b, c, d] = SEATS.slice(r * 4, r * 4 + 4);
            return [seat(a), seat(b), <span key={`g${r}`} />, seat(c), seat(d)];
          })}
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-slate-600" aria-label="Seat legend">
        {[["border-2 border-slate-300 bg-white", "Available"], ["border-2 border-blue-600 bg-blue-600", "Selected"], ["border-2 border-slate-200 bg-slate-200", "Booked"], ["border-2 border-pink-300 bg-pink-50", "Ladies only"], ["border-2 border-slate-800 bg-slate-800", "Driver"]].map(([c, t]) => (
          <li key={t} className="flex items-center gap-1.5"><span className={`h-4 w-4 rounded-t-md ${c}`} />{t}</li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── Booking summary ───────────── */
function Summary({ bus, search, seats, fare, service, total }: { bus: BusT; search: Search; seats: string[]; fare: number; service: number; total: number }) {
  const row = (k: string, v: string) => <div className="flex justify-between gap-3 py-1"><dt className="text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>;
  return (
    <aside className="self-start rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm lg:sticky lg:top-0">
      <h3 className="mb-2 font-semibold text-slate-900">Booking summary</h3>
      <dl>
        {row("Operator", `${bus.op} · ${bus.type}`)}{row("Route", `${search.from} → ${search.to}`)}
        {row("Journey date", fmtDate(search.date))}{row("Departure", t12(bus.dep))}
        {row("Seats", seats.length ? sortSeats(seats).join(", ") : "None selected")}
        <hr className="my-2 border-slate-200" />
        {row(`Ticket price × ${seats.length}`, money(fare))}{row("Service charge", money(service))}
        <div className="mt-1 flex justify-between border-t border-slate-300 pt-2 text-base font-semibold text-slate-900"><dt>Grand total</dt><dd>{money(total)}</dd></div>
      </dl>
    </aside>
  );
}

/* ───────────── Booking dialog (seats → passengers & payment) ───────────── */
function BookingDialog({ bus, search, onClose, onDone }: { bus: BusT; search: Search; onClose: () => void; onDone: (b: Booking) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [seats, setSeats] = useState<string[]>([]);
  const [pax, setPax] = useState<Record<string, Pax>>({});
  const [pay, setPay] = useState("cash");
  const [errs, setErrs] = useState<Errs>({});
  const [note, setNote] = useState("");
  const sorted = sortSeats(seats);
  const fare = seats.length * bus.price, service = seats.length * SERVICE, total = fare + service;

  const toggle = (s: string) => {
    if (seats.includes(s)) { setNote(""); return setSeats(seats.filter((x) => x !== s)); }
    if (seats.length >= search.pax) return setNote(`You can select up to ${search.pax} seat${search.pax > 1 ? "s" : ""}. Change the passenger count in search to add more.`);
    setNote(""); setSeats([...seats, s]);
  };
  const setField = (s: string, k: keyof Pax, v: string) => setPax((p) => ({ ...p, [s]: { ...(p[s] ?? blank), [k]: v } }));

  const confirm = () => {
    const e: Errs = {};
    sorted.forEach((s) => {
      const p = pax[s] ?? blank, x: Errs[string] = {};
      if (p.name.trim().length < 2) x.name = "Enter full name";
      if (!/^(\+?88)?01[3-9]\d{8}$/.test(p.mobile.replace(/[\s-]/g, ""))) x.mobile = "Enter a valid mobile, e.g. 01712345678";
      if (!p.gender) x.gender = "Select gender";
      else if (LADIES.has(s) && p.gender !== "Female") x.gender = "Ladies-only seat";
      if (p.email && !/^\S+@\S+\.\S+$/.test(p.email)) x.email = "Enter a valid email";
      if (Object.keys(x).length) e[s] = x;
    });
    setErrs(e);
    if (Object.keys(e).length) return;
    onDone({
      id: `BO-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      ref: Math.random().toString(36).slice(2, 8).toUpperCase(), bus, search, seats: sorted,
      pax: sorted.map((s) => pax[s]), fare, service, total, pay, at: new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }),
    });
  };

  return (
    <Modal label="Book seats" onClose={onClose}>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{step === 1 ? "Select seats" : "Passengers & payment"}</h2>
          <p className="text-xs text-slate-500">{bus.op} · {search.from} → {search.to} · {t12(bus.dep)}</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[1fr_300px]">
        {step === 1 ? (
          <div>
            <p className="mb-3 text-sm text-slate-600">Select up to <b>{search.pax}</b> seat{search.pax > 1 ? "s" : ""}. <span className="text-slate-500">{seats.length}/{search.pax} selected</span></p>
            {note && <p role="alert" className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{note}</p>}
            <SeatMap bus={bus} selected={seats} onToggle={toggle} />
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((s, idx) => {
              const p = pax[s] ?? blank, e = errs[s] ?? {};
              const f = (k: keyof Pax, label: string, type = "text", ph = "") => (
                <label className="block"><span className={lbl}>{label}</span>
                  <input className={inp} type={type} placeholder={ph} value={p[k]} aria-invalid={!!e[k]} onChange={(ev) => setField(s, k, ev.target.value)} />
                  {e[k] && <span role="alert" className="mt-1 block text-xs text-red-600">{e[k]}</span>}</label>
              );
              return (
                <fieldset key={s} className="rounded-lg border border-slate-200 p-4">
                  <legend className="flex items-center gap-2 px-2 text-sm font-semibold text-slate-900"><User size={14} />Passenger {idx + 1} · Seat {s}{LADIES.has(s) && <span className="rounded bg-pink-50 px-1.5 py-0.5 text-[11px] font-medium text-pink-700">Ladies only</span>}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {f("name", "Full name", "text", "As on ID")}{f("mobile", "Mobile number", "tel", "01XXXXXXXXX")}
                    <label className="block"><span className={lbl}>Gender</span>
                      <select className={inp} value={p.gender} aria-invalid={!!e.gender} onChange={(ev) => setField(s, "gender", ev.target.value)}>
                        <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                      </select>
                      {e.gender && <span role="alert" className="mt-1 block text-xs text-red-600">{e.gender}</span>}</label>
                    {f("email", "Email (optional)", "email", "name@example.com")}
                  </div>
                </fieldset>
              );
            })}
            <fieldset className="rounded-lg border border-slate-200 p-4">
              <legend className="px-2 text-sm font-semibold text-slate-900">Payment method</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENTS.map(({ id, label, hint, Icon }) => (
                  <label key={id} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition ${pay === id ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <input type="radio" name="pay" className="accent-blue-600" checked={pay === id} onChange={() => setPay(id)} />
                    <Icon size={16} className="text-slate-500" /><span><span className="block font-medium text-slate-900">{label}</span><span className="text-xs text-slate-500">{hint}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        )}
        <Summary bus={bus} search={search} seats={seats} fare={fare} service={service} total={total} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
        <div className="text-sm"><p className="text-xs text-slate-500">{seats.length ? sorted.join(", ") : "No seats selected"}</p><p className="font-semibold text-slate-900">{money(total)}</p></div>
        <div className="flex gap-2">
          {step === 2 && <button className={btnGhost} onClick={() => setStep(1)}><ArrowLeft size={16} />Seats</button>}
          {step === 1
            ? <button className={btn} disabled={!seats.length} onClick={() => setStep(2)}>Continue</button>
            : <button className={btn} onClick={confirm}><Check size={16} />Confirm booking</button>}
        </div>
      </div>
    </Modal>
  );
}

/* ───────────── Confirmation + thermal preview ───────────── */
function Confirmation({ b, onClose }: { b: Booking; onClose: () => void }) {
  const pay = PAYMENTS.find((x) => x.id === b.pay)?.label;
  return (
    <Modal label="Booking confirmed" onClose={onClose}>
      <div className="no-print flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={18} /></span>
          <div><h2 className="text-base font-semibold text-slate-900">Booking confirmed</h2><p className="text-xs text-slate-500">Ticket ID {b.id} · Ref {b.ref}</p></div>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
      </div>
      <div className="pmod grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1fr_340px]">
        <div className="no-print space-y-4 p-4 text-sm">
          <dl className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 p-4">
            {[["Operator", `${b.bus.op} (${b.bus.type})`], ["Route", `${b.search.from} → ${b.search.to}`], ["Date", fmtDate(b.search.date)], ["Departure", t12(b.bus.dep)], ["Payment", `${pay} · Paid`], ["Total", money(b.total)]].map(([k, v]) => (
              <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>
            ))}
          </dl>
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {b.seats.map((s, i) => <li key={s} className="flex justify-between px-4 py-2"><span>{b.pax[i].name} · {b.pax[i].mobile}</span><span className="font-semibold">Seat {s}</span></li>)}
          </ul>
          <div className="flex flex-wrap gap-2">
            <button className={btn} onClick={() => window.print()}><Printer size={16} />Print ticket{b.seats.length > 1 ? "s" : ""}</button>
            <button className={btnGhost} onClick={onClose}>Done</button>
          </div>
          <p className="text-xs text-slate-500">Prints one 80mm thermal ticket per seat. In the print dialog, set margins to None and scale to 100%.</p>
        </div>
        <div className="pmod overflow-y-auto bg-slate-100 p-4">
          <p className="no-print mb-3 text-center text-xs font-medium text-slate-500">80mm thermal preview</p>
          {b.seats.map((_, i) => <Ticket key={i} b={b} i={i} />)}
        </div>
      </div>
    </Modal>
  );
}

/* ───────────── Bus result card ───────────── */
const BusCard = memo(function BusCard({ bus, pax, onView }: { bus: BusT; pax: number; onView: (b: BusT) => void }) {
  const left = SEATS.length - bus.booked.length, arr = bus.dep + bus.dur;
  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm md:grid-cols-[210px_1fr_170px] md:items-center">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white">{bus.op.split(" ").map((w) => w[0]).join("").slice(0, 2)}</div>
        <div><h3 className="text-sm font-semibold text-slate-900">{bus.op}</h3><span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${badge[bus.type]}`}>{bus.type}</span></div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div><p className="text-lg font-semibold tabular-nums text-slate-900">{t12(bus.dep)}</p><p className="text-xs text-slate-500">{bus.fromSt}</p></div>
        <div className="text-center text-xs text-slate-500"><p>{hm(bus.dur)}</p><div className="my-1 h-px bg-slate-300" /></div>
        <div className="text-right"><p className="text-lg font-semibold tabular-nums text-slate-900">{t12(arr)}{arr >= 1440 && <sup className="ml-0.5 text-[10px] text-slate-500">+1</sup>}</p><p className="text-xs text-slate-500">{bus.toSt}</p></div>
      </div>
      <div className="flex items-center justify-between gap-2 md:flex-col md:items-end">
        <div className="md:text-right"><p className="text-lg font-semibold text-slate-900">{money(bus.price)}</p><p className={`text-xs ${left <= 8 ? "font-medium text-amber-600" : "text-slate-500"}`}>{left} seats left</p></div>
        <button className={btn} disabled={left < pax} onClick={() => onView(bus)}>{left === 0 ? "Sold out" : left < pax ? "Not enough seats" : "View seats"}</button>
      </div>
    </article>
  );
});

/* ───────────── Page ───────────── */
export default function Page() {
  const [draft, setDraft] = useState<Search>({ from: "Dhaka", to: "Chittagong", date: "", pax: 1 });
  const [applied, setApplied] = useState<Search>(draft);
  const [today, setToday] = useState("");
  // Read the current date only on the client, after mount (keeps prerender deterministic)
  useEffect(() => {
    const d = addDays(1);
    setToday(addDays(0));
    setDraft((s) => ({ ...s, date: d }));
    setApplied((s) => ({ ...s, date: d }));
  }, []);
  const [view, setView] = useState<"home" | "tickets">("home");
  const [types, setTypes] = useState<BusType[]>([]);
  const [slot, setSlot] = useState("all");
  const [maxP, setMaxP] = useState<number | null>(null);
  const [op, setOp] = useState("all");
  const [sort, setSort] = useState<"price" | "dep">("price");
  const [sel, setSel] = useState<BusT | null>(null);
  const [done, setDone] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [err, setErr] = useState("");

  const buses = useMemo(() => (applied.date ? buildBuses(applied) : []), [applied]);
  const lo = buses.length ? Math.min(...buses.map((b) => b.price)) : 0, hi = buses.length ? Math.max(...buses.map((b) => b.price)) : 0;
  const cap = maxP ?? hi;
  const visible = useMemo(() => {
    const slotOf = (m: number) => (m < 720 ? "morning" : m < 1020 ? "afternoon" : "night");
    return buses
      .filter((b) => (!types.length || types.includes(b.type)) && (slot === "all" || slotOf(b.dep) === slot) && b.price <= cap && (op === "all" || b.op === op))
      .sort((a, b) => (sort === "price" ? a.price - b.price || a.dep - b.dep : a.dep - b.dep));
  }, [buses, types, slot, cap, op, sort]);

  const runSearch = (s: Search) => {
    if (s.from === s.to) return setErr("Choose different cities for origin and destination.");
    if (!s.date || s.date < addDays(0)) return setErr("Choose today or a future journey date.");
    setErr(""); setMaxP(null); setApplied({ ...s }); setView("home");
  };
  const clearFilters = () => { setTypes([]); setSlot("all"); setMaxP(null); setOp("all"); };
  const go = (id: string) => { setView("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 0); };
  const onDone = (b: Booking) => { setBookings((x) => [b, ...x]); setSel(null); setDone(b); };

  const nav = [
    { l: "Home", f: () => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }, on: view === "home" },
    { l: `My Tickets${bookings.length ? ` (${bookings.length})` : ""}`, f: () => setView("tickets"), on: view === "tickets" },
    { l: "Routes", f: () => go("routes"), on: false },
    { l: "Help", f: () => go("help"), on: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <style>{PRINT_CSS}</style>

      <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
          <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-md bg-blue-600 text-white"><Bus size={18} /></span><span className="text-lg font-bold tracking-tight text-slate-900">BusOS</span></div>
          <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto" aria-label="Main">
            {nav.map((n) => <button key={n.l} onClick={n.f} aria-current={n.on ? "page" : undefined} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${n.on ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}>{n.l}</button>)}
          </nav>
          <button onClick={() => setSignedIn(!signedIn)} className={btnGhost}><User size={16} />{signedIn ? "Counter 01 · Sign out" : "Login"}</button>
        </div>
      </header>

      <main className="no-print">
        <section className="bg-slate-900 pb-16 pt-10">
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-2xl font-semibold text-white sm:text-3xl">Buy a bus ticket in under a minute</h1>
            <p className="mt-1 text-sm text-slate-300">Compare operators, pick your seat, print the ticket.</p>
          </div>
        </section>

        <div className="mx-auto -mt-10 max-w-6xl px-4">
          <form onSubmit={(e) => { e.preventDefault(); runSearch(draft); }} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg md:grid-cols-[1fr_auto_1fr_1fr_100px_auto] md:items-end">
            <label><span className={lbl}>From</span><select className={inp} value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <button type="button" aria-label="Swap origin and destination" onClick={() => setDraft({ ...draft, from: draft.to, to: draft.from })} className="grid h-10 w-10 place-items-center justify-self-center rounded-full border border-slate-300 text-slate-600 transition hover:bg-slate-50"><ArrowLeftRight size={16} /></button>
            <label><span className={lbl}>To</span><select className={inp} value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label><span className={lbl}>Journey date</span><input type="date" className={inp} min={today || undefined} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label>
            <label><span className={lbl}>Passengers</span><select className={inp} value={draft.pax} onChange={(e) => setDraft({ ...draft, pax: +e.target.value })}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
            <button className={btn}><Search size={16} />Search buses</button>
          </form>
          {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
        </div>

        {view === "tickets" ? (
          <section className="mx-auto max-w-6xl px-4 py-8">
            <h2 className="mb-4 text-lg font-semibold">My tickets</h2>
            {!bookings.length ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                <TicketIcon className="mx-auto mb-2 text-slate-400" />No tickets yet. Search for a bus to make your first booking.
              </div>
            ) : (
              <ul className="space-y-3">
                {bookings.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
                    <div><p className="font-semibold">{b.search.from} → {b.search.to} · {fmtDate(b.search.date)}</p><p className="text-slate-500">{b.bus.op} · Seats {b.seats.join(", ")} · {b.id}</p></div>
                    <div className="flex items-center gap-3"><b>{money(b.total)}</b><button className={btnGhost} onClick={() => setDone(b)}>View ticket</button></div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[250px_1fr]">
            <aside className="h-fit space-y-4 rounded-lg border border-slate-200 bg-white p-4 text-sm" aria-label="Filters">
              <div className="flex items-center justify-between"><h2 className="font-semibold">Filters</h2><button onClick={clearFilters} className="text-xs font-medium text-blue-600 hover:underline">Clear</button></div>
              <fieldset><legend className={lbl}>Bus type</legend>
                <div className="flex flex-wrap gap-2">{(["AC", "Non-AC", "Sleeper"] as BusType[]).map((t) => (
                  <button key={t} type="button" aria-pressed={types.includes(t)} onClick={() => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t])}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition ${types.includes(t) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 text-slate-600 hover:border-slate-400"}`}>{t}</button>))}</div>
              </fieldset>
              <label className="block"><span className={lbl}>Departure time</span>
                <select className={inp} value={slot} onChange={(e) => setSlot(e.target.value)}><option value="all">Any time</option><option value="morning">Morning (before 12 PM)</option><option value="afternoon">Afternoon (12–5 PM)</option><option value="night">Evening / night (after 5 PM)</option></select></label>
              <label className="block"><span className={lbl}>Max price: {money(cap)}</span>
                <input type="range" className="w-full accent-blue-600" min={lo} max={hi} step={10} value={cap} onChange={(e) => setMaxP(+e.target.value)} /></label>
              <label className="block"><span className={lbl}>Operator</span>
                <select className={inp} value={op} onChange={(e) => setOp(e.target.value)}><option value="all">All operators</option>{OPERATORS.map((o) => <option key={o.n}>{o.n}</option>)}</select></label>
            </aside>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div><h2 className="text-lg font-semibold">{applied.from} → {applied.to}</h2>
                  <p className="flex flex-wrap items-center gap-x-3 text-sm text-slate-500"><span className="flex items-center gap-1"><CalendarDays size={14} />{fmtDate(applied.date)}</span><span className="flex items-center gap-1"><Users size={14} />{applied.pax} passenger{applied.pax > 1 ? "s" : ""}</span><span>{visible.length} bus{visible.length !== 1 ? "es" : ""}</span></p></div>
                <label className="flex items-center gap-2 text-sm text-slate-600">Sort by
                  <select className={`${inp} w-auto`} value={sort} onChange={(e) => setSort(e.target.value as "price" | "dep")}><option value="price">Lowest price</option><option value="dep">Earliest departure</option></select></label>
              </div>
              {visible.length ? (
                <div className="space-y-3">{visible.map((b) => <BusCard key={b.id} bus={b} pax={applied.pax} onView={setSel} />)}</div>
              ) : !applied.date ? (
                <p className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading buses…</p>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  <p className="font-medium text-slate-700">No buses match these filters</p><p className="mt-1">Widen the price range or clear the filters to see all {buses.length} buses.</p>
                  <button className={`${btnGhost} mt-4`} onClick={clearFilters}>Clear filters</button>
                </div>
              )}
            </div>
          </section>
        )}

        <section id="routes" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-10">
          <h2 className="mb-3 text-base font-semibold">Popular routes</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map(([f, t]) => (
              <button key={f + t} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-blue-300 hover:text-blue-700"
                onClick={() => { const s = { ...draft, from: f, to: t }; setDraft(s); runSearch(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{f} <ArrowLeftRight size={12} className="text-slate-400" /> {t}</button>
            ))}
          </div>
        </section>
      </main>

      <footer id="help" className="no-print scroll-mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600">
          <p className="flex items-center gap-2"><Phone size={14} />Need help with a booking? {SUPPORT}</p>
          <p className="text-xs text-slate-400">BusOS demo · mock data only, no real payments or tickets.</p>
        </div>
      </footer>

      {sel && <BookingDialog bus={sel} search={applied} onClose={() => setSel(null)} onDone={onDone} />}
      {done && <Confirmation b={done} onClose={() => setDone(null)} />}
    </div>
  );
}
