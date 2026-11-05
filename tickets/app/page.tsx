"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  Bus,
  Check,
  CheckCircle2,
  Headphones,
  Plug,
  Printer,
  ShieldCheck,
  Wifi,
  Droplets,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Chip,
  Field,
  Input,
  Select,
  Separator,
  cn,
} from "./components/ui";

/* =====================================================================
   Demo data  (replace with API data later)
   Route: Dhaka (Kamalapur) → Cumilla (Podua Bazar)
   ===================================================================== */
const SERVICE_FEE = 30;
const MAX_SEATS = 4;

type Stop = { id: string; name: string; note?: string; offset: number };

// offset = minutes after departure from Kamalapur (demo values)
const STOPS: Stop[] = [
  { id: "kamalapur", name: "Kamalapur", note: "Dhaka · Starting point", offset: 0 },
  { id: "arambagh", name: "Arambagh", offset: 10 },
  { id: "tikatuli", name: "Tikatuli", offset: 20 },
  { id: "signboard", name: "Signboard", offset: 30 },
  { id: "kachpur", name: "Kachpur", offset: 42 },
  { id: "gouripur", name: "Gouripur", offset: 100 },
  { id: "chandina", name: "Chandina", offset: 132 },
  { id: "cantonment", name: "Cumilla Cantonment", offset: 160 },
  { id: "podua", name: "Podua Bazar", note: "Cumilla · Final stop", offset: 175 },
];
const BOARDING = STOPS.slice(0, 5);
const DROPPING = STOPS.slice(5);
const TOTAL_MIN = STOPS[STOPS.length - 1].offset;

const ROWS = "ABCDEFGHIJ".split("");
const ALL_SEATS = ROWS.flatMap((r) => [1, 2, 3, 4].map((c) => `${r}${c}`));

function pickBooked(seed: number, count: number) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const pool = [...ALL_SEATS];
  const out: string[] = [];
  while (out.length < count) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  return out;
}

const buses = [
  { id: "b1", name: "Roadline Express", cls: "AC · Business Class", ac: true, dep: 390, price: 550, amenities: ["Wi-Fi", "Charging", "Water"], booked: pickBooked(11, 14) },
  { id: "b2", name: "Podua Star", cls: "AC · Deluxe", ac: true, dep: 495, price: 450, amenities: ["Charging", "Water"], booked: pickBooked(23, 22) },
  { id: "b3", name: "Komol Coach", cls: "AC · Standard", ac: true, dep: 600, price: 420, amenities: ["Charging"], booked: pickBooked(37, 9) },
  { id: "b4", name: "Gouripur Link", cls: "Non-AC · Standard", ac: false, dep: 750, price: 280, amenities: ["Water"], booked: pickBooked(41, 17) },
  { id: "b5", name: "Night Line", cls: "Non-AC · Night Service", ac: false, dep: 1260, price: 260, amenities: [], booked: pickBooked(59, 6) },
];

const PAYMENTS = ["bKash", "Nagad", "Rocket", "Card"];
const STEPS = ["Select bus", "Choose seats", "Passenger details", "Pay & confirm"];

/* ---------------- helpers ---------------- */
const money = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

function fmtTime(min: number) {
  const t = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
const AMENITY_ICON: Record<string, ReactNode> = {
  "Wi-Fi": <Wifi size={12} />,
  Charging: <Plug size={12} />,
  Water: <Droplets size={12} />,
};

/* =====================================================================
   Page
   ===================================================================== */
export default function Page() {
  const [date, setDate] = useState("2026-11-06");
  const [filter, setFilter] = useState<"all" | "ac" | "non-ac">("all");
  const [busId, setBusId] = useState(buses[0].id);
  const [seats, setSeats] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", boarding: "kamalapur", dropping: "podua" });
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; agree?: string }>({});
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const bus = buses.find((b) => b.id === busId)!;
  const visibleBuses = buses.filter((b) => filter === "all" || (filter === "ac" ? b.ac : !b.ac));
  const bi = STOPS.findIndex((s) => s.id === form.boarding);
  const di = STOPS.findIndex((s) => s.id === form.dropping);
  const fare = seats.length * bus.price;
  const fee = seats.length ? SERVICE_FEE : 0;
  const total = fare + fee;

  const phoneOk = /^01[3-9]\d{8}$/.test(form.phone);
  const currentStep = seats.length === 0 ? 1 : form.name.trim().length >= 2 && phoneOk ? 3 : 2;

  function chooseBus(id: string) {
    setBusId(id);
    setSeats([]);
    setNotice("");
  }
  function changeFilter(f: typeof filter) {
    setFilter(f);
    const list = buses.filter((b) => f === "all" || (f === "ac" ? b.ac : !b.ac));
    if (!list.some((b) => b.id === busId)) chooseBus(list[0].id);
  }
  function toggleSeat(id: string) {
    if (bus.booked.includes(id)) return;
    setNotice("");
    if (seats.includes(id)) setSeats(seats.filter((s) => s !== id));
    else if (seats.length >= MAX_SEATS) setNotice(`You can select up to ${MAX_SEATS} seats per booking.`);
    else setSeats([...seats, id].sort());
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!seats.length) {
      setNotice("Please select at least one seat.");
      document.getElementById("seats")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Enter the passenger's full name.";
    if (!phoneOk) next.phone = "Enter a valid number, e.g. 01712345678.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setConfirmed("RL" + Math.floor(100000 + Math.random() * 900000));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() {
    setConfirmed(null);
    setSeats([]);
    setAgree(false);
    setErrors({});
    setForm({ name: "", phone: "", boarding: "kamalapur", dropping: "podua" });
  }

  /* ----------------------- confirmation view ----------------------- */
  if (confirmed) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 size={30} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Booking confirmed</h1>
              <p className="text-sm text-neutral-500">Your e-ticket has been sent to {form.phone}.</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between bg-black p-5 text-white">
              <div>
                <p className="text-[11px] tracking-[2px] text-neutral-400">BOOKING ID</p>
                <p className="mt-1 text-2xl font-bold tracking-wider">{confirmed}</p>
              </div>
              <Bus size={28} />
            </div>

            <div className="relative p-5">
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-neutral-100" />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-neutral-100" />

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-bold">{STOPS[bi].name}</p>
                  <p className="text-sm text-neutral-500">{fmtTime(bus.dep + STOPS[bi].offset)}</p>
                </div>
                <ArrowRight className="text-neutral-400" />
                <div className="text-right">
                  <p className="text-xl font-bold">{STOPS[di].name}</p>
                  <p className="text-sm text-neutral-500">{fmtTime(bus.dep + STOPS[di].offset)}</p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {[
                  ["Passenger", form.name],
                  ["Mobile", form.phone],
                  ["Journey date", fmtDate(date)],
                  ["Bus", `${bus.name} · ${bus.cls}`],
                  ["Seats", seats.join(", ")],
                  ["Payment", payment],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-neutral-500">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="my-6 border-t-2 border-dashed border-neutral-300" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-500">Total paid</p>
                  <p className="text-2xl font-bold">{money(total)}</p>
                </div>
                <QrMock value={confirmed} />
              </div>
            </div>
          </Card>

          <div className="mt-6 flex flex-col gap-3 print:hidden sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => window.print()}>
              <Printer size={17} /> Print ticket
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={reset}>
              Book another ticket
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ----------------------- booking view ----------------------- */
  return (
    <Shell>
      {/* hero band */}
      <section className="bg-black text-white print:hidden">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
          <p className="text-xs font-semibold tracking-[2px] text-neutral-400">BUS TICKET · DHAKA – CUMILLA</p>
          <h1 className="mt-3 flex flex-wrap items-center gap-x-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Dhaka <ArrowRight className="text-neutral-500" size={34} /> Cumilla
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-400 sm:text-base">
            Kamalapur to Podua Bazar via Arambagh, Tikatuli, Signboard, Kachpur, Gouripur, Chandina and Cumilla
            Cantonment · about {fmtDuration(TOTAL_MIN)}
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-16 max-w-6xl px-4 pb-28 sm:px-6 lg:pb-16">
        {/* search + stepper */}
        <Card className="mb-6">
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <Field label="From">
              <Input value="Dhaka · Kamalapur"  readOnly />
            </Field>
            <Field label="To">
              <Input value="Cumilla · Podua Bazar"  readOnly />
            </Field>
            <Field label="Journey date">
              <Input
                type="date"
                value={date}
                min="2026-11-05"
                onChange={(e) => e.target.value && setDate(e.target.value)}
              />
            </Field>
          </div>
          <Separator />
          <ol className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
            {STEPS.map((label, i) => {
              const done = i < currentStep;
              const now = i === currentStep;
              return (
                <li key={label} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                      done && "border-black bg-black text-white",
                      now && "border-black text-black",
                      !done && !now && "border-neutral-300 text-neutral-400"
                    )}
                  >
                    {done ? <Check size={14} /> : i + 1}
                  </span>
                  <span className={cn("text-sm font-semibold", !done && !now && "text-neutral-400")}>{label}</span>
                </li>
              );
            })}
          </ol>
        </Card>

        <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* 1. bus list */}
            <Card>
              <CardHeader
                title="Available buses"
                description={`${visibleBuses.length} of ${buses.length} buses · fare is per seat`}
                action={
                  <div className="flex gap-2">
                    <Chip active={filter === "all"} onClick={() => changeFilter("all")}>All</Chip>
                    <Chip active={filter === "ac"} onClick={() => changeFilter("ac")}>AC</Chip>
                    <Chip active={filter === "non-ac"} onClick={() => changeFilter("non-ac")}>Non-AC</Chip>
                  </div>
                }
              />
              <div className="grid gap-3 p-5">
                {visibleBuses.map((b) => {
                  const selected = b.id === busId;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => chooseBus(b.id)}
                      className={cn(
                        "grid gap-4 rounded-xl border p-4 text-left transition sm:grid-cols-[1.1fr_1.5fr_auto] sm:items-center",
                        selected ? "border-black ring-1 ring-black" : "border-neutral-200 hover:border-neutral-400"
                      )}
                    >
                      <div>
                        <p className="font-bold">{b.name}</p>
                        <p className="text-xs text-neutral-500">{b.cls}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {b.amenities.map((a) => (
                            <Badge key={a} variant="muted" className="gap-1 text-[11px]">
                              {AMENITY_ICON[a]} {a}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div>
                          <p className="font-bold">{fmtTime(b.dep)}</p>
                          <p className="text-[11px] text-neutral-500">Kamalapur</p>
                        </div>
                        <div className="flex flex-1 flex-col items-center">
                          <span className="text-[11px] text-neutral-500">{fmtDuration(TOTAL_MIN)}</span>
                          <span className="my-1 h-px w-full bg-neutral-300" />
                          <span className="text-[11px] text-neutral-500">7 stops</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{fmtTime(b.dep + TOTAL_MIN)}</p>
                          <p className="text-[11px] text-neutral-500">Podua Bazar</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                        <p className="text-xl font-bold">{money(b.price)}</p>
                        <p className="text-xs text-neutral-500">{40 - b.booked.length} seats left</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* 2. route & stops */}
            <Card>
              <CardHeader
                title="Route & stoppages"
                description={`${bus.name} · times are estimates for this bus`}
              />
              <ol className="p-5">
                {STOPS.map((s, i) => {
                  const within = i >= bi && i <= di;
                  const end = i === bi || i === di;
                  return (
                    <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < STOPS.length - 1 && (
                        <span
                          className={cn(
                            "absolute bottom-0 left-[9px] top-6 w-0.5",
                            i >= bi && i < di ? "bg-black" : "bg-neutral-200"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-2",
                          end ? "border-black bg-black" : within ? "border-black bg-white" : "border-neutral-300 bg-white"
                        )}
                      />
                      <div className="flex flex-1 items-start justify-between gap-3">
                        <div>
                          <p className={cn("text-sm font-semibold", !within && "text-neutral-400")}>{s.name}</p>
                          {s.note && <p className="text-xs text-neutral-500">{s.note}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {i === bi && <Badge>Boarding</Badge>}
                          {i === di && <Badge>Dropping</Badge>}
                          <span className="text-xs font-medium tabular-nums text-neutral-500">
                            {fmtTime(bus.dep + s.offset)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {/* 3. seats */}
            <Card id="seats">
              <CardHeader
                title="Select seats"
                description={`Choose up to ${MAX_SEATS} seats · ${bus.name}`}
                action={
                  <div className="flex flex-wrap justify-end gap-3 text-xs text-neutral-600">
                    <Legend className="border border-neutral-300 bg-white" label="Available" />
                    <Legend className="bg-black" label="Selected" />
                    <Legend className="bg-neutral-200" label="Booked" />
                  </div>
                }
              />
              <div className="p-5">
                <div className="mx-auto w-full max-w-[320px] rounded-[28px] border-2 border-neutral-300 px-5 pb-6 pt-4">
                  <div className="mb-4 flex items-center justify-between border-b border-dashed border-neutral-300 pb-3 text-xs font-semibold text-neutral-500">
                    <span>FRONT</span>
                    <span>DRIVER</span>
                  </div>
                  <div className="space-y-2.5">
                    {ROWS.map((row) => (
                      <div key={row} className="flex items-center justify-center gap-2">
                        {[1, 2].map((c) => (
                          <Seat key={c} id={`${row}${c}`} booked={bus.booked} selected={seats} onToggle={toggleSeat} />
                        ))}
                        <div className="w-8 text-center text-[10px] text-neutral-400">{row}</div>
                        {[3, 4].map((c) => (
                          <Seat key={c} id={`${row}${c}`} booked={bus.booked} selected={seats} onToggle={toggleSeat} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <p role="status" className="mt-4 min-h-5 text-center text-sm font-medium">{notice}</p>
              </div>
            </Card>

            {/* 4. passenger */}
            <Card>
              <CardHeader title="Passenger details" description="Your e-ticket will be sent to this mobile number." />
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <Input
                    value={form.name}
                    invalid={!!errors.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahim Uddin"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Mobile number" error={errors.phone}>
                  <Input
                    value={form.phone}
                    invalid={!!errors.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                    placeholder="01XXXXXXXXX"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Boarding point">
                  <Select value={form.boarding} onChange={(e) => setForm({ ...form, boarding: e.target.value })}>
                    {BOARDING.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {fmtTime(bus.dep + s.offset)}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Dropping point">
                  <Select value={form.dropping} onChange={(e) => setForm({ ...form, dropping: e.target.value })}>
                    {DROPPING.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {fmtTime(bus.dep + s.offset)}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </Card>

            {/* 5. payment */}
            <Card>
              <CardHeader title="Payment method" description="You will be redirected to complete the payment." />
              <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
                {PAYMENTS.map((p) => (
                  <Chip
                    key={p}
                    active={payment === p}
                    onClick={() => setPayment(p)}
                    className="h-12 rounded-xl"
                  >
                    {p}
                  </Chip>
                ))}
              </div>
            </Card>
          </div>

          {/* summary */}
          <aside id="summary" className="lg:sticky lg:top-24">
            <Card>
              <CardHeader title="Booking summary" />
              <div className="space-y-4 p-5 text-sm">
                <div>
                  <p className="font-bold">{bus.name}</p>
                  <p className="text-xs text-neutral-500">{bus.cls} · {fmtDate(date)}</p>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl bg-neutral-100 p-3">
                  <div>
                    <p className="font-semibold">{STOPS[bi].name}</p>
                    <p className="text-xs text-neutral-500">{fmtTime(bus.dep + STOPS[bi].offset)}</p>
                  </div>
                  <ArrowRight size={16} className="text-neutral-400" />
                  <div className="text-right">
                    <p className="font-semibold">{STOPS[di].name}</p>
                    <p className="text-xs text-neutral-500">{fmtTime(bus.dep + STOPS[di].offset)}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-neutral-500">SELECTED SEATS</p>
                  {seats.length ? (
                    <div className="flex flex-wrap gap-2">{seats.map((s) => <Badge key={s}>{s}</Badge>)}</div>
                  ) : (
                    <p className="text-neutral-400">No seat selected yet.</p>
                  )}
                </div>

                <Separator />

                <dl className="space-y-2">
                  <Row k={`Fare (${seats.length} × ${money(bus.price)})`} v={money(fare)} />
                  <Row k="Service fee" v={money(fee)} />
                </dl>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold tracking-tight">{money(total)}</span>
                </div>

                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  error={errors.agree}
                  label="I agree to the terms and cancellation policy."
                />

                <Button type="submit" size="lg" className="w-full" disabled={!seats.length}>
                  Pay {money(total)}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                  <ShieldCheck size={14} /> Free cancellation up to 6 hours before departure
                </p>
              </div>
            </Card>

            <Card className="mt-4 p-5">
              <div className="flex items-center gap-3 text-sm">
                <Headphones size={20} />
                <div>
                  <p className="font-semibold">Need help?</p>
                  <p className="text-xs text-neutral-500">Call 16000 · 7 AM – 11 PM</p>
                </div>
              </div>
            </Card>
          </aside>
        </form>
      </div>

      {/* mobile sticky total */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white p-3 lg:hidden print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1">
          <div>
            <p className="text-xs text-neutral-500">{seats.length} seat{seats.length === 1 ? "" : "s"}</p>
            <p className="text-lg font-bold leading-tight">{money(total)}</p>
          </div>
          <Button
            type="button"
            onClick={() =>
              document.getElementById(seats.length ? "summary" : "seats")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {seats.length ? "Review & pay" : "Select seats"}
          </Button>
        </div>
      </div>
    </Shell>
  );
}

/* =====================================================================
   Local components
   ===================================================================== */
function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
              <Bus size={19} />
            </span>
            Roadline
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-600 md:flex">
            <a className="text-black" href="#">Book tickets</a>
            <a className="hover:text-black" href="#">My bookings</a>
            <a className="hover:text-black" href="#">Offers</a>
            <a className="hover:text-black" href="#">Help</a>
          </nav>
          <Button variant="outline" size="sm">Log in</Button>
        </div>
      </header>

      {children}

      <footer className="border-t border-neutral-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Roadline. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Cancellation policy</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Seat({
  id,
  booked,
  selected,
  onToggle,
}: {
  id: string;
  booked: string[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const isBooked = booked.includes(id);
  const isSelected = selected.includes(id);
  return (
    <button
      type="button"
      disabled={isBooked}
      aria-pressed={isSelected}
      aria-label={`Seat ${id}${isBooked ? ", booked" : ""}`}
      onClick={() => onToggle(id)}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg text-xs font-semibold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        isBooked && "cursor-not-allowed bg-neutral-200 text-neutral-400",
        !isBooked && isSelected && "bg-black text-white",
        !isBooked && !isSelected && "border border-neutral-300 bg-white hover:border-black"
      )}
    >
      {id}
    </button>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-3.5 w-3.5 rounded", className)} />
      {label}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <dt>{k}</dt>
      <dd className="font-medium text-black">{v}</dd>
    </div>
  );
}

/* Decorative QR-style block generated from the booking id (not a real QR code) */
function QrMock({ value }: { value: string }) {
  const n = 21;
  let s = 7;
  for (const ch of value) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const cells: ReactNode[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const fx = x < 7 ? x : x >= n - 7 ? x - (n - 7) : -1;
      const fy = y < 7 ? y : y >= n - 7 ? y - (n - 7) : -1;
      const finder = fx >= 0 && fy >= 0 && !(x >= n - 7 && y >= n - 7);
      let on: boolean;
      if (finder) on = fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
      else on = rand() > 0.5;
      if (on) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-24 w-24" role="img" aria-label="Ticket code">
      {cells}
    </svg>
  );
}
