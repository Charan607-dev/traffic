import React from "react";
import type { TrafficCondition } from "../../types/traffic";

interface CongestionCardProps {
    condition: TrafficCondition;
    onSelect?: (junctionId: string) => void;
}

export const CongestionCard: React.FC<CongestionCardProps> = ({
    condition,
    onSelect,
}) => {
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
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">
                    {condition.junctionName}
                </span>
                <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getBadgeClass(
                        condition.congestionLevel
                    )}`}
                >
                    {condition.congestionLevel}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                    <span className="text-slate-400 block">Vehicles</span>
                    <span className="font-semibold text-slate-200">
                        {condition.vehicleCount}
                    </span>
                </div>
                <div>
                    <span className="text-slate-400 block">Speed</span>
                    <span className="font-semibold text-slate-200">
                        {condition.averageSpeed} km/h
                    </span>
                </div>
                <div>
                    <span className="text-slate-400 block">Idle Est.</span>
                    <span className="font-semibold text-slate-200">
                        {condition.estimatedIdleTime}m
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CongestionCard;
