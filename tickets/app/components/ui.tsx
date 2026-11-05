import * as React from "react";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------- Button ---------- */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "disabled:pointer-events-none disabled:opacity-40",
        variant === "solid" && "bg-black text-white hover:bg-neutral-800",
        variant === "outline" &&
          "border border-neutral-300 bg-white text-black hover:border-black",
        variant === "ghost" && "text-black hover:bg-neutral-100",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        className
      )}
    />
  );
}

/* ---------- Card ---------- */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white shadow-sm",
        className
      )}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 p-5">
      <div>
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-neutral-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  variant = "solid",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "solid" | "muted" | "outline";
}) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "solid" && "bg-black text-white",
        variant === "muted" && "bg-neutral-100 text-neutral-700",
        variant === "outline" && "border border-neutral-300 text-neutral-700",
        className
      )}
    />
  );
}

/* ---------- Form field (label + input/select + error) ---------- */
const control =
  "h-11 w-full rounded-lg border bg-white px-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-black underline">{error}</span>}
    </label>
  );
}

export function Input({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(control, invalid ? "border-black" : "border-neutral-300", className)}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(control, "border-neutral-300", className)}
    />
  );
}

export function Separator({ className }: { className?: string }) {
  return <hr className={cn("border-t border-neutral-200", className)} />;
}
