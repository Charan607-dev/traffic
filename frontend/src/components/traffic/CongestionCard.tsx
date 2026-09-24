import React from "react";
import type { TrafficCondition, TrafficPrediction } from "../../types/traffic";

interface CongestionCardProps {
    condition: TrafficCondition;
    prediction?: TrafficPrediction | null;
    isLoading?: boolean;
    onSelect?: (junctionId: string) => void;
}

export const CongestionCard: React.FC<CongestionCardProps> = ({
    condition,
    prediction,
    isLoading,
    onSelect,
}) => {
    const displayLevel = prediction?.congestionLevel || condition.congestionLevel;
    const getBadgeClass = (level: string) => {
        switch (level) {
            case "Very High":
            case "High":
                return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
            case "Moderate":
                return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
            default:
                return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
        }
    };

    return (
        <div
            onClick={() => onSelect && onSelect(condition.junctionId)}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between relative group"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white font-mono">
                        {condition.junctionName}
                    </span>
                    {prediction && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                            ML
                        </span>
                    )}
                </div>
                <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getBadgeClass(
                        displayLevel
                    )}`}
                >
                    {isLoading ? "Analyzing..." : displayLevel}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                    <span className="text-slate-400 block text-[10px]">Vehicles</span>
                    <span className="font-semibold text-slate-200">
                        {condition.vehicleCount}
                    </span>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px]">Speed</span>
                    <span className="font-semibold text-slate-200">
                        {condition.averageSpeed} km/h
                    </span>
                </div>
                <div>
                    <span className="text-slate-400 block text-[10px]">
                        {prediction ? "ML Score" : "Idle Est."}
                    </span>
                    <span className="font-semibold text-cyan-300">
                        {prediction
                            ? `${prediction.predictedCongestionScore}%`
                            : `${condition.estimatedIdleTime}m`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CongestionCard;
