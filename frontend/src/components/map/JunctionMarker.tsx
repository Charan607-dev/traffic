import {
    AlertTriangle,
    CircleGauge,
} from "lucide-react";

interface JunctionMarkerProps {
    name: string;
    congestionLevel: "Low" | "Moderate" | "High" | "Very High";
    congestionIndex: number;
}

function JunctionMarker({
    name,
    congestionLevel,
    congestionIndex,
}: JunctionMarkerProps) {
    const isCritical =
        congestionLevel === "High" ||
        congestionLevel === "Very High";

    return (
        <div className="rounded-xl border border-gray-700 bg-gray-950 p-3 shadow-xl">
            <div className="flex items-center gap-2">
                {isCritical ? (
                    <AlertTriangle
                        size={16}
                        className="text-red-400"
                    />
                ) : (
                    <CircleGauge
                        size={16}
                        className="text-green-400"
                    />
                )}

                <span className="text-sm font-semibold text-white">
                    {name}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-5">
                <span className="text-xs text-gray-500">
                    Congestion
                </span>

                <span
                    className={`text-sm font-bold ${isCritical
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                >
                    {congestionIndex}/100
                </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-5">
                <span className="text-xs text-gray-500">
                    Level
                </span>

                <span className="text-xs font-medium text-gray-300">
                    {congestionLevel}
                </span>
            </div>
        </div>
    );
}

export default JunctionMarker;