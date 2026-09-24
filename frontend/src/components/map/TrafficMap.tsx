import { useState, useEffect, useRef } from "react";
import {
    AlertTriangle,
    MapPin,
    Navigation,
    Route,
    Layers,
    Key,
    ExternalLink,
    CheckCircle2,
    RefreshCw,
} from "lucide-react";
import { loadGoogleMapsScript, GOOGLE_MAPS_API_KEY } from "../../services/map";

interface MapRoute {
    id: string;
    name: string;
    color: string;
    strokeColorHex: string;
    points: {
        x: number;
        y: number;
        lat: number;
        lng: number;
    }[];
}

const routes: MapRoute[] = [
    {
        id: "R-001",
        name: "Eco Route",
        color: "bg-green-500",
        strokeColorHex: "#22c55e",
        points: [
            { x: 12, y: 72, lat: 12.9610, lng: 77.5850 },
            { x: 25, y: 62, lat: 12.9690, lng: 77.5910 },
            { x: 39, y: 66, lat: 12.9750, lng: 77.5960 },
            { x: 52, y: 48, lat: 12.9830, lng: 77.6030 },
            { x: 68, y: 43, lat: 12.9920, lng: 77.6120 },
            { x: 86, y: 27, lat: 13.0040, lng: 77.6250 },
        ],
    },
    {
        id: "R-002",
        name: "Fast Route",
        color: "bg-blue-500",
        strokeColorHex: "#3b82f6",
        points: [
            { x: 12, y: 72, lat: 12.9610, lng: 77.5850 },
            { x: 28, y: 76, lat: 12.9630, lng: 77.5940 },
            { x: 42, y: 61, lat: 12.9780, lng: 77.6010 },
            { x: 54, y: 54, lat: 12.9840, lng: 77.6090 },
            { x: 70, y: 34, lat: 12.9960, lng: 77.6170 },
            { x: 86, y: 27, lat: 13.0040, lng: 77.6250 },
        ],
    },
    {
        id: "R-003",
        name: "Low Traffic Route",
        color: "bg-yellow-400",
        strokeColorHex: "#facc15",
        points: [
            { x: 12, y: 72, lat: 12.9610, lng: 77.5850 },
            { x: 22, y: 50, lat: 12.9740, lng: 77.5890 },
            { x: 36, y: 38, lat: 12.9830, lng: 77.5950 },
            { x: 51, y: 31, lat: 12.9910, lng: 77.6020 },
            { x: 68, y: 22, lat: 13.0010, lng: 77.6110 },
            { x: 86, y: 27, lat: 13.0040, lng: 77.6250 },
        ],
    },
];

const junctions = [
    {
        name: "Central Junction",
        x: 52,
        y: 48,
        lat: 12.9830,
        lng: 77.6030,
        level: "Very High",
    },
    {
        name: "Market Junction",
        x: 68,
        y: 43,
        lat: 12.9920,
        lng: 77.6120,
        level: "High",
    },
    {
        name: "Metro Junction",
        x: 39,
        y: 66,
        lat: 12.9750,
        lng: 77.5960,
        level: "Moderate",
    },
    {
        name: "Residential Junction",
        x: 68,
        y: 22,
        lat: 13.0010,
        lng: 77.6110,
        level: "Low",
    },
];

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#171c26" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#171c26" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#74859a" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#a5b4fc" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#64748b" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#1e293b" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#283548" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1e2430" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#94a3b8" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#334155" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1e293b" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#1e293b" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0b132b" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#475569" }],
    },
];

function TrafficMap() {
    const [apiKey, setApiKey] = useState<string>(() => {
        return (
            localStorage.getItem("USER_GOOGLE_MAPS_KEY") ||
            GOOGLE_MAPS_API_KEY ||
            ""
        );
    });
    const [inputKey, setInputKey] = useState("");
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [mapMode, setMapMode] = useState<"google" | "telemetry">("telemetry");
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [trafficLayerActive, setTrafficLayerActive] = useState(true);

    const googleMapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const trafficLayerRef = useRef<any>(null);

    // Initialize or re-init Google Maps if mode is 'google' and API key is present
    useEffect(() => {
        if (mapMode !== "google" || !apiKey) return;

        let isMounted = true;
        setIsLoadingGoogle(true);
        setLoadError(null);

        loadGoogleMapsScript(apiKey)
            .then(() => {
                if (!isMounted || !googleMapContainerRef.current) return;
                const google = window.google;
                if (!google?.maps) return;

                // Create Map Instance
                const mapCenter = { lat: 12.9820, lng: 77.6050 };
                const map = new google.maps.Map(googleMapContainerRef.current, {
                    center: mapCenter,
                    zoom: 13,
                    styles: darkMapStyle,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                });

                mapInstanceRef.current = map;

                // Add real Google traffic layer
                const trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);
                trafficLayerRef.current = trafficLayer;

                // Render Route Polylines
                routes.forEach((r) => {
                    const polyline = new google.maps.Polyline({
                        path: r.points.map((p) => ({ lat: p.lat, lng: p.lng })),
                        geodesic: true,
                        strokeColor: r.strokeColorHex,
                        strokeOpacity: 0.85,
                        strokeWeight: 4,
                    });
                    polyline.setMap(map);
                });

                // Render Junction Markers
                junctions.forEach((j) => {
                    const isHigh = j.level === "High" || j.level === "Very High";
                    const marker = new google.maps.Marker({
                        position: { lat: j.lat, lng: j.lng },
                        map: map,
                        title: `${j.name} (${j.level} Congestion)`,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: isHigh ? "#ef4444" : "#eab308",
                            fillOpacity: 0.9,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                        },
                    });

                    const infoWindow = new google.maps.InfoWindow({
                        content: `
                            <div style="color: #0f172a; font-family: sans-serif; padding: 4px;">
                                <div style="font-weight: bold; font-size: 13px;">${j.name}</div>
                                <div style="font-size: 11px; color: ${isHigh ? '#dc2626' : '#d97706'}; font-weight: 600; margin-top: 2px;">
                                    Congestion: ${j.level}
                                </div>
                            </div>
                        `,
                    });

                    marker.addListener("click", () => {
                        infoWindow.open(map, marker);
                    });
                });

                setIsLoadingGoogle(false);
            })
            .catch((err) => {
                if (isMounted) {
                    setIsLoadingGoogle(false);
                    setLoadError(err.message || "Failed to load Google Maps");
                }
            });

        return () => {
            isMounted = false;
        };
    }, [apiKey, mapMode]);

    const toggleTrafficLayer = () => {
        if (!trafficLayerRef.current) return;
        if (trafficLayerActive) {
            trafficLayerRef.current.setMap(null);
            setTrafficLayerActive(false);
        } else {
            trafficLayerRef.current.setMap(mapInstanceRef.current);
            setTrafficLayerActive(true);
        }
    };

    const handleSaveKey = () => {
        const cleaned = inputKey.trim();
        if (cleaned) {
            setApiKey(cleaned);
            localStorage.setItem("USER_GOOGLE_MAPS_KEY", cleaned);
            setMapMode("google");
            setIsKeyModalOpen(false);
            setInputKey("");
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-xl">
            {/* Header controls */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-800 p-4 gap-3 bg-slate-900/60 backdrop-blur">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-white tracking-wide text-sm font-mono flex items-center gap-2">
                            <Route className="w-4 h-4 text-cyan-400" />
                            URBAN TRAFFIC MAP ENGINE
                        </h2>
                        {apiKey && (
                            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" /> API KEY ACTIVE
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Visualizing congestion indexes, route corridors & real-time telemetry
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* View Switcher: Telemetry vs Google Maps */}
                    <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                        <button
                            type="button"
                            onClick={() => setMapMode("telemetry")}
                            className={`px-3 py-1.5 rounded-lg transition ${
                                mapMode === "telemetry"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Telemetry Sim
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (!apiKey) {
                                    setIsKeyModalOpen(true);
                                } else {
                                    setMapMode("google");
                                }
                            }}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                                mapMode === "google"
                                    ? "bg-blue-600 text-white font-medium"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            Google Maps
                        </button>
                    </div>

                    {/* Google Maps Key Configuration Button */}
                    <button
                        type="button"
                        onClick={() => setIsKeyModalOpen(true)}
                        title="Configure Google Maps API Key"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-mono text-slate-200 hover:bg-slate-700 hover:border-cyan-500/50 transition"
                    >
                        <Key className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="hidden sm:inline">
                            {apiKey ? "Change Key" : "Set API Key"}
                        </span>
                    </button>

                    {mapMode === "google" && apiKey && (
                        <button
                            type="button"
                            onClick={toggleTrafficLayer}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition ${
                                trafficLayerActive
                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                    : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                        >
                            Traffic Layer: {trafficLayerActive ? "ON" : "OFF"}
                        </button>
                    )}
                </div>
            </div>

            {/* Modal for setting Google Maps API Key */}
            {isKeyModalOpen && (
                <div className="p-4 border-b border-cyan-500/30 bg-slate-950/95 transition">
                    <div className="max-w-xl mx-auto space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-sm font-semibold text-white font-mono">
                                    Configure Google Maps API Key
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsKeyModalOpen(false)}
                                className="text-xs text-slate-400 hover:text-white"
                            >
                                ✕ Close
                            </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Enter your key to render live Google Maps with real-time traffic layers. You can also configure it in{" "}
                            <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-700 font-mono">
                                frontend/.env
                            </code>{" "}
                            as <code className="text-cyan-300 font-mono">VITE_GOOGLE_MAPS_API_KEY</code>.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="Paste AIzaSy... Google Maps API key"
                                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-500"
                            />
                            <button
                                type="button"
                                onClick={handleSaveKey}
                                disabled={!inputKey.trim()}
                                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-medium disabled:opacity-40 transition"
                            >
                                Save & Activate
                            </button>
                        </div>
                        {apiKey && (
                            <p className="text-[11px] font-mono text-slate-400">
                                Current active key: {apiKey.slice(0, 8)}••••••••••••••••{apiKey.slice(-4)}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* MAP VIEW CONTAINER */}
            <div className="relative h-[520px] overflow-hidden bg-[#0c121e]">
                {mapMode === "google" ? (
                    apiKey ? (
                        <>
                            <div
                                ref={googleMapContainerRef}
                                className="w-full h-full"
                            />
                            {isLoadingGoogle && (
                                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-cyan-400 gap-3 font-mono text-xs">
                                    <RefreshCw className="w-6 h-6 animate-spin" />
                                    Loading Google Maps tiles & traffic data...
                                </div>
                            )}
                            {loadError && (
                                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
                                    <AlertTriangle className="w-10 h-10 text-rose-400 mb-2" />
                                    <h4 className="text-white font-mono font-bold text-sm">
                                        Google Maps Authorization or Network Error
                                    </h4>
                                    <p className="text-xs text-rose-300/90 max-w-md mt-1 font-mono">
                                        {loadError}
                                    </p>
                                    <p className="text-xs text-slate-400 max-w-md mt-3 leading-relaxed">
                                        Ensure your API key has <strong>Maps JavaScript API</strong> enabled in the Google Cloud Console.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setMapMode("telemetry")}
                                        className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white transition border border-slate-700"
                                    >
                                        Switch back to Telemetry Simulation
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                            <Key className="w-12 h-12 text-yellow-400 mb-3" />
                            <h3 className="text-white font-mono font-bold text-base">
                                Google Maps API Key Required
                            </h3>
                            <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                                To render the live Google Map view with dynamic traffic flow and junctions, add your Google Maps JavaScript API key.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsKeyModalOpen(true)}
                                className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-600/30 transition"
                            >
                                Enter API Key
                            </button>
                        </div>
                    )
                ) : (
                    /* Isometric Telemetry Canvas View */
                    <>
                        {/* Background road network */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute left-[15%] top-0 h-full w-px bg-gray-600" />
                            <div className="absolute left-[35%] top-0 h-full w-px bg-gray-600" />
                            <div className="absolute left-[55%] top-0 h-full w-px bg-gray-600" />
                            <div className="absolute left-[75%] top-0 h-full w-px bg-gray-600" />

                            <div className="absolute left-0 top-[20%] h-px w-full bg-gray-600" />
                            <div className="absolute left-0 top-[40%] h-px w-full bg-gray-600" />
                            <div className="absolute left-0 top-[60%] h-px w-full bg-gray-600" />
                            <div className="absolute left-0 top-[80%] h-px w-full bg-gray-600" />
                        </div>

                        {/* Route lines */}
                        {routes.map((route) => (
                            <div key={route.id}>
                                {route.points.slice(0, -1).map((point, index) => {
                                    const next = route.points[index + 1];

                                    const dx = next.x - point.x;
                                    const dy = next.y - point.y;
                                    const length = Math.sqrt(dx * dx + dy * dy);
                                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                                    return (
                                        <div
                                            key={`${route.id}-${index}`}
                                            className={`absolute h-1 rounded-full opacity-80 ${route.color}`}
                                            style={{
                                                left: `${point.x}%`,
                                                top: `${point.y}%`,
                                                width: `${length}%`,
                                                transform: `rotate(${angle}deg)`,
                                                transformOrigin: "0 50%",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        ))}

                        {/* Start Point */}
                        <div className="absolute left-[12%] top-[72%] -translate-x-1/2 -translate-y-1/2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-green-400 bg-green-500/20 shadow-lg shadow-green-500/20">
                                <Navigation size={17} className="text-green-400" />
                            </div>

                            <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-gray-950 px-2 py-1 text-[10px] text-gray-300 border border-gray-800 font-mono">
                                Start
                            </span>
                        </div>

                        {/* Destination */}
                        <div className="absolute left-[86%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-red-400 bg-red-500/20 shadow-lg shadow-red-500/20">
                                <MapPin size={18} className="text-red-400" />
                            </div>

                            <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-gray-950 px-2 py-1 text-[10px] text-gray-300 border border-gray-800 font-mono">
                                Destination
                            </span>
                        </div>

                        {/* Junctions */}
                        {junctions.map((junction) => {
                            const isHigh =
                                junction.level === "High" ||
                                junction.level === "Very High";

                            return (
                                <div
                                    key={junction.name}
                                    className="absolute -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${junction.x}%`,
                                        top: `${junction.y}%`,
                                    }}
                                >
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                            isHigh
                                                ? "border-red-400 bg-red-500/20 animate-pulse"
                                                : "border-yellow-400 bg-yellow-500/20"
                                        }`}
                                    >
                                        <AlertTriangle
                                            size={14}
                                            className={
                                                isHigh ? "text-red-400" : "text-yellow-400"
                                            }
                                        />
                                    </div>
                                    <span className="absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-mono text-slate-300 border border-slate-800">
                                        {junction.name}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Telemetry Indicator */}
                        <div className="absolute left-4 top-4 rounded-xl border border-gray-700 bg-gray-950/90 p-3 backdrop-blur">
                            <div className="flex items-center gap-2">
                                <Route size={16} className="text-blue-400" />
                                <span className="text-xs font-semibold text-gray-200 font-mono">
                                    Simulated Flow Matrix
                                </span>
                            </div>
                            <p className="mt-1 text-[10px] text-gray-400">
                                Switch to Google Maps above for real geography
                            </p>
                        </div>
                    </>
                )}

                {/* Common Legend */}
                <div className="absolute bottom-4 left-4 rounded-xl border border-gray-700 bg-gray-950/90 p-3 backdrop-blur shadow-lg">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 font-mono">
                        Route Corridors
                    </p>

                    <div className="space-y-1.5">
                        <Legend color="bg-green-500" label="Eco Route (-28% CO2)" />
                        <Legend color="bg-blue-500" label="Fast Route (Shortest Time)" />
                        <Legend color="bg-yellow-400" label="Low Congestion Route" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface LegendProps {
    color: string;
    label: string;
}

function Legend({ color, label }: LegendProps) {
    return (
        <div className="flex items-center gap-2">
            <span className={`h-2 w-5 rounded-full ${color}`} />
            <span className="text-[11px] text-gray-300 font-mono">{label}</span>
        </div>
    );
}

export default TrafficMap;