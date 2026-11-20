import { useEffect, useState, useCallback } from 'react';
import { Locate, ShieldCheck, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { Temple } from '@/data/temples';
import { Button } from './ui/button';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapView.module.css';
import { Link } from 'react-router-dom';

interface CustodianMarkerData {
  _id: string;
  name: string;
  category: string;
  culturalAffiliation?: string;
  location?: {
    coordinates?: [number, number]; // [lng, lat]
    city?: string;
    address?: string;
  };
}

interface ExperienceMarkerData {
  _id: string;
  title: string;
  category: string;
  price: number;
  durationMinutes: number;
  custodianId?: {
    name?: string;
  };
  location?: {
    coordinates?: [number, number]; // [lng, lat]
    city?: string;
  };
}

interface MapViewProps {
  temples: Temple[];
  selectedTemple: Temple | null;
  onTempleSelect: (temple: Temple) => void;
  custodians?: CustodianMarkerData[];
  experiences?: ExperienceMarkerData[];
}

// Custom hook to fly to a location
function FlyToLocation({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo({ lat: coords[1], lng: coords[0] }, 13, { duration: 1 });
  }, [coords, map]);
  return null;
}

const MapView = ({
  temples,
  selectedTemple,
  onTempleSelect,
  custodians = [],
  experiences = []
}: MapViewProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showTemples, setShowTemples] = useState(true);
  const [showCustodians, setShowCustodians] = useState(true);
  const [showExperiences, setShowExperiences] = useState(true);

  // Generate marker coordinates from temple location - memoized
  const getTempleCoords = useCallback((temple: Temple): [number, number] => {
    const baseCoords: Record<string, [number, number]> = {
      Mangalore: [74.856, 12.9141],
      Udupi: [74.7421, 13.3409],
      Kundapura: [74.6897, 13.6281],
      "Uttara Kannada": [74.4851, 14.0940],
    };

    const base = baseCoords[temple.region] || [74.856, 13.0827];
    const offset = (parseInt(temple.id.slice(-2), 36) / 1000);
    return [base[0] + (offset - 0.05), base[1] + (offset - 0.05)];
  }, []);

  // Temple marker icon
  const getTempleMarkerIcon = useCallback((isSelected: boolean) => {
    return L.divIcon({
      className: styles.customMarker,
      html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${
          isSelected ? "hsl(31 92% 45%)" : "hsl(27 96% 61%)"
        }" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: scale(${
        isSelected ? 1.25 : 1
      }); transition: transform 0.2s;">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, []);

  // Custodian marker icon (Emerald)
  const getCustodianMarkerIcon = useCallback(() => {
    return L.divIcon({
      className: styles.customMarker,
      html: `
        <div style="background-color: #059669; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  // Experience marker icon (Indigo / Purple)
  const getExperienceMarkerIcon = useCallback(() => {
    return L.divIcon({
      className: styles.customMarker,
      html: `
        <div style="background-color: #7c3aed; color: white; border-radius: 9999px; padding: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  return (
    <div className={styles.mapContainer}>
      {/* Interactive Map Filter Layers */}
      <div className="absolute top-3 left-3 z-[1000] bg-card/95 backdrop-blur-md border border-border rounded-lg p-1.5 shadow-md flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setShowTemples(!showTemples)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
            showTemples
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium"
              : "text-muted-foreground opacity-60 hover:opacity-100"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Temples ({temples.length})</span>
        </button>

        {custodians.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCustodians(!showCustodians)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              showCustodians
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-muted-foreground opacity-60 hover:opacity-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Custodians ({custodians.length})</span>
          </button>
        )}

        {experiences.length > 0 && (
          <button
            type="button"
            onClick={() => setShowExperiences(!showExperiences)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              showExperiences
                ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 font-medium"
                : "text-muted-foreground opacity-60 hover:opacity-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experiences ({experiences.length})</span>
          </button>
        )}
      </div>

      <MapContainer
        center={[13.0827, 74.856]}
        zoom={9}
        className={styles.map}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />

        {/* Temple Markers */}
        {showTemples &&
          temples.map((temple) => {
            const coords = getTempleCoords(temple);
            const isSelected = selectedTemple?.id === temple.id;
            return (
              <Marker
                key={temple.id}
                position={[coords[1], coords[0]]}
                icon={getTempleMarkerIcon(isSelected)}
                eventHandlers={{
                  click: () => onTempleSelect(temple),
                }}
              >
                <Popup>
                  <div className="text-sm p-1">
                    <p className="font-semibold text-foreground">{temple.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{temple.location}</p>
                    <button
                      type="button"
                      onClick={() => onTempleSelect(temple)}
                      className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                    >
                      View Sanctum Dossier &rarr;
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Custodian Markers */}
        {showCustodians &&
          custodians.map((c) => {
            const rawCoords = c.location?.coordinates;
            // Ensure coordinates exist and are valid numbers
            const coords =
              Array.isArray(rawCoords) && rawCoords.length >= 2
                ? [Number(rawCoords[0]), Number(rawCoords[1])]
                : [74.856 + (Math.random() * 0.1 - 0.05), 12.9141 + (Math.random() * 0.1 - 0.05)];

            return (
              <Marker
                key={`custodian-${c._id}`}
                position={[coords[1], coords[0]]}
                icon={getCustodianMarkerIcon()}
              >
                <Popup>
                  <div className="text-sm p-1">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Cultural Custodian
                    </div>
                    <p className="font-bold text-foreground text-sm">{c.name}</p>
                    {c.culturalAffiliation && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {c.culturalAffiliation}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      {c.location?.city || "Coastal Karnataka"}
                    </p>
                    <Link
                      to={`/custodians/${c._id}`}
                      className="text-xs text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      View Lineage & Knowledge <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Experience Markers */}
        {showExperiences &&
          experiences.map((exp) => {
            const rawCoords = exp.location?.coordinates;
            const coords =
              Array.isArray(rawCoords) && rawCoords.length >= 2
                ? [Number(rawCoords[0]), Number(rawCoords[1])]
                : [74.742 + (Math.random() * 0.1 - 0.05), 13.34 + (Math.random() * 0.1 - 0.05)];

            return (
              <Marker
                key={`experience-${exp._id}`}
                position={[coords[1], coords[0]]}
                icon={getExperienceMarkerIcon()}
              >
                <Popup>
                  <div className="text-sm p-1">
                    <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Living Cultural Experience
                    </div>
                    <p className="font-bold text-foreground text-sm">{exp.title}</p>
                    {exp.custodianId?.name && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Guided by {exp.custodianId.name}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs mt-2 mb-2 font-medium">
                      <span className="text-foreground">₹{exp.price} / person</span>
                      <span className="text-muted-foreground">{exp.durationMinutes} mins</span>
                    </div>
                    <Link
                      to={`/experiences/${exp._id}`}
                      className="text-xs text-purple-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      Reserve Slot <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: styles.userLocation,
              html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          />
        )}

        {selectedTemple && (
          <FlyToLocation coords={getTempleCoords(selectedTemple)} />
        )}
      </MapContainer>

      <Button
        onClick={handleLocateMe}
        className="absolute bottom-4 left-4 z-[1000] bg-card text-foreground hover:bg-card/90 shadow-lg"
        size="icon"
        aria-label="Locate me"
      >
        <Locate className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapView;
