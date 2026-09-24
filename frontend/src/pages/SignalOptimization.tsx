import {
    Brain,
    Clock3,
    Gauge,
    Lightbulb,
    TrendingDown,
    Zap,
    SlidersHorizontal,
    Activity,
} from "lucide-react";

import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { signalRecommendations } from "../data/demoTrafficData";

function SignalOptimization() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#07090e] text-slate-100 overflow-hidden font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} systemStatus="OPTIMAL" />

                <main className="p-4 sm:p-6 space-y-6 max-w-[1700px] w-full mx-auto">
                    {/* Hero Cyber Header Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-fuchsia-500/30 bg-slate-900 p-6 sm:p-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                        <div className="scanline"></div>

                        <div className="torn-tape -top-2 left-10 rotate-[-2deg]"></div>
                        <div className="torn-tape-cyan -bottom-2 right-14 rotate-[3deg]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-fuchsia-400" />
                                        ADAPTIVE GREEN WAVE
                                    </span>
                                    <span className="text-xs font-mono text-cyan-400">
                                        // REINFORCEMENT LEARNING CONTROLLER
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3">
                                    <SlidersHorizontal className="w-7 h-7 text-fuchsia-400" />
                                    DYNAMIC SIGNAL OPTIMIZATION
                                </h1>
                                <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    Heuristic phase timing synchronization and micro-split adaptation to maximize arterial throughput while eliminating vehicle idle friction.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs">
                                <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-fuchsia-500/25 transition uppercase">
                                    <Zap className="w-4 h-4" />
                                    Synchronize All Nodes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* AI Engine Status Alert Card */}
                    <div className="collage-card rounded-2xl p-5 border border-fuchsia-500/30 flex items-start gap-4">
                        <div className="rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 p-3 text-fuchsia-400">
                            <Brain size={24} />
                        </div>
                        <div>
                            <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wide">
                                NEURAL CYCLE CONTROLLER STATUS :: ONLINE
                            </h2>
                            <p className="mt-1 text-xs text-slate-300 font-sans leading-relaxed">
                                Continuous evaluation of inflow queue density predicts upstream saturation and dynamically redistributes green phase intervals across intersecting arterial lanes.
                            </p>
                        </div>
                    </div>

                    {/* Signal Recommendations Grid */}
                    <div className="grid grid-cols-1 gap-5">
                        {signalRecommendations.map((recommendation) => (
                            <div
                                key={recommendation.junctionId}
                                className="collage-card rounded-2xl p-6 relative overflow-hidden border border-slate-800 hover:border-fuchsia-500/40 group"
                            >
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-white font-mono">
                                                {recommendation.junctionName}
                                            </h2>
                                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                                                {recommendation.junctionId}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-cyan-400/80 font-mono">
                                            AI Confidence: {recommendation.confidence}% • Dynamic Phase Active
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-mono font-bold text-emerald-400">
                                        <TrendingDown size={15} />
                                        -{recommendation.expectedIdleTimeReduction}% IDLE FRICTION
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 font-mono">
                                    <TimingCard
                                        icon={Clock3}
                                        title="GREEN PHASE"
                                        current={`${recommendation.currentGreenTime}s`}
                                        recommended={`${recommendation.recommendedGreenTime}s`}
                                        isGreen
                                    />
                                    <TimingCard
                                        icon={Gauge}
                                        title="RED CLEARANCE"
                                        current={`${recommendation.currentRedTime}s`}
                                        recommended={`${recommendation.recommendedRedTime}s`}
                                    />
                                    <TimingCard
                                        icon={Lightbulb}
                                        title="CO₂ DAMPENING"
                                        current="Standard"
                                        recommended={`-${recommendation.expectedCO2Reduction}%`}
                                        isGreen
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

interface TimingCardProps {
    icon: typeof Clock3;
    title: string;
    current: string;
    recommended: string;
    isGreen?: boolean;
}

function TimingCard({
    icon: Icon,
    title,
    current,
    recommended,
    isGreen = false,
}: TimingCardProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center gap-2 text-slate-400">
                <Icon size={16} className="text-cyan-400" />
                <span className="text-xs uppercase">{title}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-slate-500">CURRENT</p>
                    <p className="mt-0.5 font-bold text-slate-400 text-sm">{current}</p>
                </div>

                <div className="text-cyan-500 text-sm font-bold">→</div>

                <div className="text-right">
                    <p className="text-[10px] text-slate-500">OPTIMIZED</p>
                    <p className={`mt-0.5 font-bold text-sm ${isGreen ? "text-emerald-400" : "text-rose-400"}`}>
                        {recommended}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignalOptimization;