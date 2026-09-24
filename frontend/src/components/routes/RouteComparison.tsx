import {
    Car,
    CheckCircle2,
    Clock3,
    Cloud,
    Fuel,
    Leaf,
    Volume2,
} from "lucide-react";

import type { RouteOption } from "../../types/route";

const demoRoutes: RouteOption[] = [
    {
        id: "R-001",
        name: "Eco Route",
        start: {
            name: "Start",
            latitude: 12.9716,
            longitude: 77.5946,
        },
        destination: {
            name: "Destination",
            latitude: 13.0358,
            longitude: 77.597,
        },
        distance: 9.8,
        estimatedTravelTime: 28,
        traffic: {
            congestionLevel: "Moderate",
            averageSpeed: 31,
            vehicleDensity: 48,
            estimatedDelay: 5,
        },
        sustainability: {
            estimatedFuel: 0.72,
            estimatedFuelSaved: 0.18,
            estimatedCO2: 1.68,
            estimatedCO2Saved: 0.42,
            noiseImpact: "Low",
            noiseScore: 32,
        },
        isRecommended: true,
    },
    {
        id: "R-002",
        name: "Fast Route",
        start: {
            name: "Start",
            latitude: 12.9716,
            longitude: 77.5946,
        },
        destination: {
            name: "Destination",
            latitude: 13.0358,
            longitude: 77.597,
        },
        distance: 8.6,
        estimatedTravelTime: 24,
        traffic: {
            congestionLevel: "High",
            averageSpeed: 25,
            vehicleDensity: 66,
            estimatedDelay: 7,
        },
        sustainability: {
            estimatedFuel: 0.91,
            estimatedFuelSaved: 0.05,
            estimatedCO2: 2.14,
            estimatedCO2Saved: 0.16,
            noiseImpact: "Moderate",
            noiseScore: 51,
        },
        isRecommended: false,
    },
    {
        id: "R-003",
        name: "Low Traffic Route",
        start: {
            name: "Start",
            latitude: 12.9716,
            longitude: 77.5946,
        },
        destination: {
            name: "Destination",
            latitude: 13.0358,
            longitude: 77.597,
        },
        distance: 11.2,
        estimatedTravelTime: 31,
        traffic: {
            congestionLevel: "Low",
            averageSpeed: 38,
            vehicleDensity: 34,
            estimatedDelay: 2,
        },
        sustainability: {
            estimatedFuel: 0.68,
            estimatedFuelSaved: 0.22,
            estimatedCO2: 1.54,
            estimatedCO2Saved: 0.51,
            noiseImpact: "Low",
            noiseScore: 27,
        },
        isRecommended: false,
    },
];

function RouteComparison() {
    return (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
            <div className="mb-5">
                <h2 className="text-base font-semibold text-white">
                    AI Route Comparison
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Predicted conditions for available routes.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {demoRoutes.map((route) => (
                    <div
                        key={route.id}
                        className={`rounded-xl border p-4 ${route.isRecommended
                                ? "border-blue-500/50 bg-blue-500/5"
                                : "border-gray-800 bg-gray-950"
                            }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Car size={18} className="text-blue-400" />

                                    <h3 className="font-semibold text-white">
                                        {route.name}
                                    </h3>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    {route.distance} km
                                </p>
                            </div>

                            {route.isRecommended && (
                                <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase text-blue-400">
                                    Recommended
                                </span>
                            )}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <Metric
                                icon={Clock3}
                                label="Travel"
                                value={`${route.estimatedTravelTime} min`}
                            />

                            <Metric
                                icon={Car}
                                label="Traffic"
                                value={route.traffic.congestionLevel}
                            />

                            <Metric
                                icon={Fuel}
                                label="Fuel"
                                value={`${route.sustainability.estimatedFuel} L`}
                            />

                            <Metric
                                icon={Cloud}
                                label="CO₂"
                                value={`${route.sustainability.estimatedCO2} kg`}
                            />

                            <Metric
                                icon={Volume2}
                                label="Noise"
                                value={route.sustainability.noiseImpact}
                            />

                            <Metric
                                icon={Leaf}
                                label="Saved"
                                value={`${route.sustainability.estimatedCO2Saved} kg`}
                            />
                        </div>

                        <div className="mt-5 border-t border-gray-800 pt-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                    Estimated delay
                                </span>

                                <span className="font-semibold text-gray-300">
                                    +{route.traffic.estimatedDelay} min
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                    Fuel saved
                                </span>

                                <span className="font-semibold text-green-400">
                                    {route.sustainability.estimatedFuelSaved} L
                                </span>
                            </div>
                        </div>

                        {route.isRecommended && (
                            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-400">
                                <CheckCircle2 size={15} />
                                Best balanced route
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface MetricProps {
    icon: typeof Clock3;
    label: string;
    value: string;
}

function Metric({ icon: Icon, label, value }: MetricProps) {
    return (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
            <div className="flex items-center gap-2 text-gray-500">
                <Icon size={14} />
                <span className="text-[11px]">{label}</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-gray-200">
                {value}
            </p>
        </div>
    );
}

export default RouteComparison;