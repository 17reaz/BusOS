import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { navigation, operations } from "@/features/admin/data/demo-data";
import { Bus, ChevronDown, ChevronRight, Command, LifeBuoy, MoreHorizontal, X } from "lucide-react";

function AdminSidebar({ active, onNavigate, onClose }: { active: string; onNavigate: (page: string) => void; onClose: () => void }) {
  return (
    <>
          <div className="flex h-[72px] items-center gap-3 px-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bus className="size-5" strokeWidth={2.3} /></div>
            <div className="min-w-0"><p className="text-[15px] font-bold tracking-tight">BusOS</p><p className="text-[11px] text-muted-foreground">BUSINESS OPERATIONS</p></div>
            <Button variant="ghost" size="icon" className="ml-auto size-8 lg:hidden" onClick={onClose} aria-label="Close menu"><X className="size-4" /></Button>
          </div>
          <div className="px-4 pb-4"><button className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left hover:bg-muted"><div className="flex size-8 items-center justify-center rounded-md bg-muted"><Command className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Dhaka Express Ltd.</p><p className="text-[11px] text-muted-foreground">Administrator</p></div><ChevronDown className="size-4 text-muted-foreground" /></button></div>
          <div className="px-3">
            <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
            <nav className="space-y-1">{navigation.map((item) => { const Icon = item.icon; const selected = active === item.label; return <button key={item.label} onClick={() => onNavigate(item.label)} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-[17px]" /><span className="flex-1 text-left">{item.label}</span>{item.count && <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${selected ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted"}`}>{item.count}</span>}</button>; })}</nav>
            <p className="px-3 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Management</p>
            <nav className="space-y-1">{operations.map((item) => { const Icon = item.icon; const selected = active === item.label; return <button key={item.label} onClick={() => { setActive(item.label); setSearch(""); setMobileOpen(false); }} className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${selected ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="size-[17px]" /><span className="flex-1 text-left">{item.label}</span></button>; })}</nav>
          </div>
          <div className="mt-auto p-3"><div className="rounded-xl border bg-muted/40 p-3"><div className="mb-2 flex items-center gap-2"><LifeBuoy className="size-4" /><span className="text-xs font-semibold">Need a hand?</span></div><p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">Visit the help center for setup guides and support.</p><Button variant="outline" size="sm" className="h-8 w-full bg-background text-xs">Help center <ChevronRight className="ml-auto size-3.5" /></Button></div><div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2"><Avatar className="size-8"><AvatarFallback className="bg-muted text-[11px] font-semibold">RA</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Reaz Ahmed</p><p className="text-[11px] text-muted-foreground">Owner account</p></div><MoreHorizontal className="size-4 text-muted-foreground" /></div></div>
        </>
  );
}

export { AdminSidebar };
