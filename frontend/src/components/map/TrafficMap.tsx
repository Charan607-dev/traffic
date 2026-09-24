import {
    AlertTriangle,
    MapPin,
    Navigation,
    Route,
} from "lucide-react";

interface MapRoute {
    id: string;
    name: string;
    color: string;
    points: {
        x: number;
        y: number;
    }[];
}

const routes: MapRoute[] = [
    {
        id: "R-001",
        name: "Eco Route",
        color: "bg-green-500",
        points: [
            { x: 12, y: 72 },
            { x: 25, y: 62 },
            { x: 39, y: 66 },
            { x: 52, y: 48 },
            { x: 68, y: 43 },
            { x: 86, y: 27 },
        ],
    },
    {
        id: "R-002",
        name: "Fast Route",
        color: "bg-blue-500",
        points: [
            { x: 12, y: 72 },
            { x: 28, y: 76 },
            { x: 42, y: 61 },
            { x: 54, y: 54 },
            { x: 70, y: 34 },
            { x: 86, y: 27 },
        ],
    },
    {
        id: "R-003",
        name: "Low Traffic Route",
        color: "bg-yellow-400",
        points: [
            { x: 12, y: 72 },
            { x: 22, y: 50 },
            { x: 36, y: 38 },
            { x: 51, y: 31 },
            { x: 68, y: 22 },
            { x: 86, y: 27 },
        ],
    },
];

const junctions = [
    {
        name: "Central Junction",
        x: 52,
        y: 48,
        level: "Very High",
    },
    {
        name: "Market Junction",
        x: 68,
        y: 43,
        level: "High",
    },
    {
        name: "Metro Junction",
        x: 39,
        y: 66,
        level: "Moderate",
    },
    {
        name: "Residential Junction",
        x: 68,
        y: 22,
        level: "Low",
    },
];

function TrafficMap() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
                <div>
                    <h2 className="font-semibold text-white">
                        Urban Traffic Map
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Traffic conditions and route intelligence
                    </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Live Monitoring
                </div>
            </div>

            <div className="relative h-[500px] overflow-hidden bg-[#111827]">
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

                {/* Start */}
                <div className="absolute left-[12%] top-[72%] -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-green-400 bg-green-500/20 shadow-lg shadow-green-500/20">
                        <Navigation size={17} className="text-green-400" />
                    </div>

                    <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-gray-950 px-2 py-1 text-[10px] text-gray-300">
                        Start
                    </span>
                </div>

                {/* Destination */}
                <div className="absolute left-[86%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-red-400 bg-red-500/20 shadow-lg shadow-red-500/20">
                        <MapPin size={18} className="text-red-400" />
                    </div>

                    <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded bg-gray-950 px-2 py-1 text-[10px] text-gray-300">
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
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isHigh
                                        ? "border-red-400 bg-red-500/20"
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
                        </div>
                    );
                })}

                {/* Map label */}
                <div className="absolute left-4 top-4 rounded-xl border border-gray-700 bg-gray-950/90 p-3 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Route size={16} className="text-blue-400" />

                        <span className="text-xs font-semibold text-gray-200">
                            Route Intelligence
                        </span>
                    </div>

                    <p className="mt-1 text-[10px] text-gray-500">
                        AI traffic visualization
                    </p>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 rounded-xl border border-gray-700 bg-gray-950/90 p-3 backdrop-blur">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        Routes
                    </p>

                    <div className="space-y-2">
                        <Legend color="bg-green-500" label="Eco Route" />
                        <Legend color="bg-blue-500" label="Fast Route" />
                        <Legend
                            color="bg-yellow-400"
                            label="Low Traffic Route"
                        />
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

            <span className="text-[11px] text-gray-400">
                {label}
            </span>
        </div>
    );
}

export default TrafficMap;