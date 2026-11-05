"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bus,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Field,
  Input,
  Select,
  Separator,
  cn,
} from "./components/ui";

/* ---------------- demo data ---------------- */
const ROUTE = { from: "Dhaka", to: "Chattogram", date: "Fri, 6 Nov 2026" };
const SERVICE_FEE = 30;
const MAX_SEATS = 4;

const buses = [
  {
    id: "b1",
    name: "Green Line",
    type: "AC · Sleeper",
    dep: "08:30 AM",
    arr: "02:30 PM",
    duration: "6h",
    price: 1200,
    booked: ["A1", "A2", "B3", "C1", "C4", "D2", "E1", "E2", "F3", "G4", "H1", "J2", "J3"],
  },
  {
    id: "b2",
    name: "Hanif Enterprise",
    type: "AC · Business",
    dep: "10:00 AM",
    arr: "04:30 PM",
    duration: "6h 30m",
    price: 950,
    booked: ["A3", "A4", "B1", "B2", "C2", "C3", "D1", "D4", "E3", "F1", "F2", "G1", "G2", "G3", "H4", "I1", "I2", "J1"],
  },
  {
    id: "b3",
    name: "Desh Travels",
    type: "Non-AC",
    dep: "11:30 PM",
    arr: "05:30 AM",
    duration: "6h",
    price: 700,
    booked: ["B4", "C1", "E4", "H2", "H3", "I3"],
  },
];

const ROWS = "ABCDEFGHIJ".split("");
const BOARDING = ["Kallyanpur", "Gabtoli", "Sayedabad", "Fakirapool"];
const DROPPING = ["AK Khan", "Oxygen", "Bahaddarhat"];

const money = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

/* ---------------- page ---------------- */
export default function BookingPage() {
  const [busId, setBusId] = useState(buses[0].id);
  const [seats, setSeats] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    boarding: BOARDING[0],
    dropping: DROPPING[0],
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const bus = buses.find((b) => b.id === busId)!;
  const fare = seats.length * bus.price;
  const fee = seats.length ? SERVICE_FEE : 0;
  const total = fare + fee;

  function chooseBus(id: string) {
    setBusId(id);
    setSeats([]);
    setNotice("");
  }

  function toggleSeat(id: string) {
    if (bus.booked.includes(id)) return;
    setNotice("");
    if (seats.includes(id)) {
      setSeats(seats.filter((s) => s !== id));
    } else if (seats.length >= MAX_SEATS) {
      setNotice(`You can select up to ${MAX_SEATS} seats.`);
    } else {
      setSeats([...seats, id].sort());
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!seats.length) {
      setNotice("Please select at least one seat.");
      return;
    }
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Enter the passenger's full name.";
    if (!/^01[3-9]\d{8}$/.test(form.phone)) next.phone = "Enter a valid number, e.g. 01712345678.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setConfirmed("BK" + Math.floor(100000 + Math.random() * 900000));
  }

  function reset() {
    setConfirmed(null);
    setSeats([]);
    setForm({ name: "", phone: "", boarding: BOARDING[0], dropping: DROPPING[0] });
    setErrors({});
  }

  /* ---------- confirmation ---------- */
  if (confirmed) {
    return (
      <Shell>
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 size={28} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Booking confirmed</h1>
              <p className="text-sm text-neutral-500">Your ticket has been sent by SMS.</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="bg-black p-5 text-white">
              <p className="text-xs tracking-[2px] text-neutral-400">BOOKING ID</p>
              <p className="mt-1 text-2xl font-bold tracking-wider">{confirmed}</p>
            </div>
            <div className="relative p-5">
              {/* ticket notches */}
              <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-neutral-100" />
              <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-neutral-100" />
              <div className="flex items-center justify-between text-lg font-bold">
                {ROUTE.from}
                <ArrowRight size={18} className="text-neutral-400" />
                {ROUTE.to}
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {[
                  ["Passenger", form.name],
                  ["Phone", form.phone],
                  ["Date", ROUTE.date],
                  ["Departure", bus.dep],
                  ["Bus", `${bus.name} (${bus.type})`],
                  ["Seats", seats.join(", ")],
                  ["Boarding", form.boarding],
                  ["Dropping", form.dropping],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-neutral-500">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="my-5 border-t-2 border-dashed border-neutral-300" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Total paid</span>
                <span className="text-xl font-bold">{money(total)}</span>
              </div>
            </div>
          </Card>

          <Button variant="outline" size="lg" className="mt-6 w-full" onClick={reset}>
            Book another ticket
          </Button>
        </div>
      </Shell>
    );
  }

  /* ---------- booking ---------- */
  return (
    <Shell>
      {/* route summary */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">{ROUTE.date}</p>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight">
            {ROUTE.from}
            <ArrowRight size={26} className="text-neutral-400" />
            {ROUTE.to}
          </h1>
        </div>
        <Badge variant="outline">{buses.length} buses available</Badge>
      </div>

      <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* 1. bus */}
          <Card>
            <CardHeader title="1. Choose your bus" description="Prices are per seat." />
            <div className="grid gap-3 p-5">
              {buses.map((b) => {
                const selected = b.id === busId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseBus(b.id)}
                    className={cn(
                      "flex flex-col gap-3 rounded-xl border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between",
                      selected
                        ? "border-black ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          selected ? "bg-black text-white" : "bg-neutral-100"
                        )}
                      >
                        <Bus size={20} />
                      </div>
                      <div>
                        <p className="font-bold">{b.name}</p>
                        <p className="text-xs text-neutral-500">{b.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock3 size={15} />
                      {b.dep} – {b.arr}
                      <span className="text-neutral-400">· {b.duration}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <p className="text-lg font-bold">{money(b.price)}</p>
                      <p className="text-xs text-neutral-500">{40 - b.booked.length} seats left</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2. seats */}
          <Card>
            <CardHeader
              title="2. Select seats"
              description={`Choose up to ${MAX_SEATS} seats.`}
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
              <p role="status" className="mt-4 min-h-5 text-center text-sm font-medium">
                {notice}
              </p>
            </div>
          </Card>

          {/* 3. passenger */}
          <Card>
            <CardHeader title="3. Passenger details" description="We will send the ticket to this number." />
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
                  {BOARDING.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Dropping point">
                <Select value={form.dropping} onChange={(e) => setForm({ ...form, dropping: e.target.value })}>
                  {DROPPING.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24">
          <Card>
            <CardHeader title="Booking summary" />
            <div className="space-y-4 p-5 text-sm">
              <div>
                <p className="font-bold">{bus.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <MapPin size={13} />
                  {ROUTE.from} → {ROUTE.to} · {bus.dep}
                </p>
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-xs font-semibold text-neutral-500">SELECTED SEATS</p>
                {seats.length ? (
                  <div className="flex flex-wrap gap-2">
                    {seats.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
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

              <Button type="submit" size="lg" className="w-full" disabled={!seats.length}>
                Confirm booking
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <ShieldCheck size={14} />
                Free cancellation up to 6 hours before departure
              </p>
            </div>
          </Card>
        </aside>
      </form>
    </Shell>
  );
}

/* ---------------- small local components ---------------- */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
              <Bus size={19} />
            </span>
            Roadline
          </div>
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
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
