import React from "react";
import type { SignalRecommendation } from "../../types/traffic";

interface SignalCardProps {
    recommendation: SignalRecommendation;
    onApply?: (junctionId: string) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
    recommendation,
    onApply,
}) => {
    return (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">
                    {recommendation.junctionName}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {Math.round(recommendation.confidence * 100)}% Conf.
                </span>
            </div>

            <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                    <span>Green Split:</span>
                    <span className="font-semibold text-emerald-400">
                        {recommendation.currentGreenTime}s → {recommendation.recommendedGreenTime}s
                    </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                    <span>Red Phase:</span>
                    <span className="font-semibold text-rose-400">
                        {recommendation.currentRedTime}s → {recommendation.recommendedRedTime}s
                    </span>
                </div>
                <div className="flex justify-between items-center text-slate-400 border-t border-slate-800 pt-2">
                    <span>Expected Idle Cut:</span>
                    <span className="text-emerald-300 font-medium">
                        -{recommendation.expectedIdleTimeReduction}s
                    </span>
                </div>
            </div>

            {onApply && (
                <button
                    onClick={() => onApply(recommendation.junctionId)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
                >
                    Apply Optimization
                </button>
            )}
        </div>
    );
};

export default SignalCard;
