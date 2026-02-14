import { useState, useEffect, useMemo, Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";

interface Store {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  hours: string | null;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center bg-card">
          <div className="text-center p-4">
            <AlertTriangle className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-xs text-muted-foreground">Map unavailable</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LazyMap = ({ store, userLocation }: {
  store: Store;
  userLocation: { lat: number; lng: number } | null;
}) => {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, leaflet]) => {
      if (cancelled) return;
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setL(leaflet.default);
      setMapComponents(rl);
    });
    return () => { cancelled = true; };
  }, []);

  if (!MapComponents || !L) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  const lightMode = document.documentElement.classList.contains("light");
  const tileUrl = lightMode
    ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const userIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "hue-rotate-180 brightness-150",
  });

  return (
    <MapContainer
      key={store.id}
      center={[store.latitude, store.longitude]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}
      <Marker position={[store.latitude, store.longitude]}>
        <Popup>
          <div className="text-xs">
            <p className="font-bold">{store.name}</p>
            <p>{store.address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const StoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("stores").select("*").then(({ data }) => {
      if (data) setStores(data as Store[]);
      setLoading(false);
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: -26.0167, lng: 28.1067 })
    );
  }, []);

  const sortedStores = useMemo(() => {
    if (!userLocation) return stores;
    return [...stores].sort((a, b) =>
      getDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude) -
      getDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
    );
  }, [stores, userLocation]);

  // Auto-select nearest store
  useEffect(() => {
    if (sortedStores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(sortedStores[0].id);
    }
  }, [sortedStores, selectedStoreId]);

  const selectedStore = stores.find(s => s.id === selectedStoreId);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-foreground">Stores</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Tap a store to view on map</p>
      </div>

      <div className="mx-4 mb-4 h-56 rounded-2xl overflow-hidden border border-border">
        {!loading && selectedStore ? (
          <MapErrorBoundary>
            <LazyMap
              store={selectedStore}
              userLocation={userLocation}
            />
          </MapErrorBoundary>
        ) : (
          <div className="h-full flex items-center justify-center bg-card">
            <p className="text-xs text-muted-foreground">Select a store below</p>
          </div>
        )}
      </div>

      <div className="px-4 space-y-3">
        {sortedStores.map((store, i) => {
          const dist = userLocation ? getDistance(userLocation.lat, userLocation.lng, store.latitude, store.longitude) : null;
          const isSelected = store.id === selectedStoreId;
          return (
            <motion.div key={store.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
              onClick={() => setSelectedStoreId(store.id)}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-colors ${isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground"}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground pr-2">{store.name}</h3>
                {dist !== null && <span className="text-xs text-accent font-medium whitespace-nowrap">{dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}</span>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin size={12} /><span>{store.address}</span></div>
                {store.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone size={12} /><span>{store.phone}</span></div>}
                {store.hours && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock size={12} /><span>{store.hours}</span></div>}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-secondary border border-border rounded-lg py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Navigation size={14} /> Get Directions
              </a>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default StoresPage;
