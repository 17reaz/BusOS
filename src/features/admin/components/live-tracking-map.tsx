import { useEffect, useRef, useState } from "react";
import { Activity, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trackingVehicles } from "@/features/admin/data/demo-data";

function LiveTrackingMap() {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState("TR-2048");
  const [positions, setPositions] = useState(() => trackingVehicles.map((vehicle) => ({ ...vehicle, step: 1, lat: vehicle.path[1][0], lng: vehicle.path[1][1] })));

  useEffect(() => {
    let cancelled = false;
    const loadLeaflet = async () => {
      if (!document.querySelector('link[data-leaflet="true"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.dataset.leaflet = "true";
        document.head.appendChild(link);
      }
      if (!window.L) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector('script[data-leaflet="true"]') as HTMLScriptElement | null;
          if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener("error", () => reject(new Error("Map library failed to load")), { once: true });
            if (window.L) resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.dataset.leaflet = "true";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Map library failed to load"));
          document.body.appendChild(script);
        });
      }
      if (cancelled || !mapElement.current || !window.L) return;
      const L = window.L;
      const map = L.map(mapElement.current, { scrollWheelZoom: true }).setView([23.7, 90.9], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const bounds: any[] = [];
      trackingVehicles.forEach((vehicle) => {
        const latlngs = vehicle.path.map((point) => [point[0], point[1]]);
        L.polyline(latlngs, { color: "#737373", weight: 3, opacity: 0.45, dashArray: "7 8" }).addTo(map);
        const point = vehicle.path[1];
        bounds.push(point);
        const icon = L.divIcon({
          className: "busos-map-marker",
          html: '<div style="width:34px;height:34px;border:2px solid white;border-radius:11px;background:#171717;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px #0005"><span style="font-size:17px">▰</span></div>',
          iconSize: [34, 34], iconAnchor: [17, 17],
        });
        const marker = L.marker(point, { icon }).addTo(map);
        marker.bindPopup('<strong>' + vehicle.id + '</strong><br/>' + vehicle.name + '<br/>Driver: ' + vehicle.driver);
        marker.on("click", () => setSelected(vehicle.id));
        markersRef.current[vehicle.id] = marker;
      });
      map.fitBounds(L.latLngBounds(bounds).pad(0.22));
      mapRef.current = map;
      setReady(true);
      setTimeout(() => map.invalidateSize(), 150);
    };
    loadLeaflet().catch(() => setReady(false));
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markersRef.current = {}; } };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPositions((current) => current.map((vehicle) => {
        if (vehicle.status === "Stopped") return vehicle;
        const nextStep = vehicle.step >= vehicle.path.length - 1 ? 1 : vehicle.step + 1;
        const point = vehicle.path[nextStep];
        const next = { ...vehicle, step: nextStep, lat: point[0], lng: point[1] };
        markersRef.current[vehicle.id]?.setLatLng(point);
        return next;
      }));
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const focusVehicle = (id: string) => {
    setSelected(id);
    const vehicle = positions.find((item) => item.id === id);
    if (vehicle && mapRef.current) {
      mapRef.current.flyTo([vehicle.lat, vehicle.lng], 10, { duration: 0.8 });
      markersRef.current[id]?.openPopup();
    }
  };

  return <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
    <Card className="overflow-hidden rounded-xl border py-0 shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div><p className="text-sm font-semibold">Bangladesh live vehicle map</p><p className="text-[11px] text-muted-foreground">Demo GPS positions · updates every 5 seconds</p></div>
        <Badge className="gap-1.5 rounded-md bg-foreground text-background"><span className="size-1.5 animate-pulse rounded-full bg-background" /> LIVE DEMO</Badge>
      </div>
      <div ref={mapElement} className="h-[440px] w-full bg-muted/40 sm:h-[540px]" />
      {!ready && <div className="border-t px-4 py-2 text-[11px] text-muted-foreground">Loading map tiles… An internet connection is required.</div>}
      <div className="flex flex-wrap items-center gap-4 border-t px-4 py-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-foreground" /> Active vehicle</span><span>Dashed lines show sample route paths</span><span className="ml-auto">Map data © OpenStreetMap</span></div>
    </Card>
    <div className="space-y-3">
      <Card className="rounded-xl border py-4 shadow-none"><CardContent className="px-4">
        <div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold">Vehicles on the road</p><Badge variant="outline" className="text-[10px]">4 tracked</Badge></div>
        <div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-muted/50 p-3"><p className="text-[10px] text-muted-foreground">Moving</p><p className="mt-1 text-xl font-semibold">3</p></div><div className="rounded-lg bg-muted/50 p-3"><p className="text-[10px] text-muted-foreground">Stopped</p><p className="mt-1 text-xl font-semibold">1</p></div></div>
      </CardContent></Card>
      <div className="space-y-2">{positions.map((vehicle) => <button key={vehicle.id} onClick={() => focusVehicle(vehicle.id)} className={`w-full rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/50 ${selected === vehicle.id ? "border-foreground" : ""}`}>
        <div className="flex items-start justify-between gap-2"><div className="flex min-w-0 items-center gap-2"><div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"><Bus className="size-4" /></div><div className="min-w-0"><p className="text-xs font-semibold">{vehicle.id}</p><p className="truncate text-[10px] text-muted-foreground">{vehicle.name}</p></div></div><StatusBadge value={vehicle.status} /></div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2"><div><p className="text-[10px] text-muted-foreground">Speed</p><p className="text-xs font-medium">{vehicle.speed} km/h</p></div><div><p className="text-[10px] text-muted-foreground">ETA</p><p className="text-xs font-medium">{vehicle.eta}</p></div></div>
        <p className="mt-2 text-[10px] text-muted-foreground">GPS: {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)} · Click to locate</p>
      </button>)}</div>
    </div>
  </div>;
}
