import {
    AlertTriangle,
    CarFront,
    Clock3,
    Gauge,
    Flame,
    Zap,
    Radio,
} from "lucide-react";

import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { bottlenecks } from "../data/demoTrafficData";

function Bottlenecks() {
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
                <Header onMenuClick={() => setSidebarOpen(true)} systemStatus="CONGESTED" />

                <main className="p-4 sm:p-6 space-y-6 max-w-[1700px] w-full mx-auto">
                    {/* Hero Cyber Header Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-rose-500/30 bg-slate-900 p-6 sm:p-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                        <div className="scanline"></div>

                        <div className="torn-tape -top-2 left-10 rotate-[-3deg]"></div>
                        <div className="torn-tape-cyan -bottom-2 right-12 rotate-[3deg]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                                        <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
                                        ANOMALY RADAR MATRIX
                                    </span>
                                    <span className="text-xs font-mono text-cyan-400">
                                        // SATURATION THRESHOLD {'>'} 80%
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3">
                                    <AlertTriangle className="w-7 h-7 text-rose-400" />
                                    CRITICAL BOTTLENECK RADAR
                                </h1>
                                <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    Real-time junction grid telemetry identifying severe arterial choke-points, micro-queuing dynamics, and AI mitigation intervention paths.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/40 text-left">
                                    <span className="text-[10px] text-rose-400 block font-semibold">HIGH RISK NODES</span>
                                    <span className="text-lg font-bold text-white">{bottlenecks.length} INTERSECTIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottlenecks List Cards */}
                    <div className="grid grid-cols-1 gap-5">
                        {bottlenecks.map((bottleneck) => (
                            <div
                                key={bottleneck.id}
                                className="collage-card rounded-2xl p-6 relative overflow-hidden border border-rose-500/30 group"
                            >
                                <div className="absolute top-2 right-3 text-[10px] font-mono text-rose-400/80">
                                    NODE_ID: {bottleneck.id}
                                </div>

                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 group-hover:scale-105 transition">
                                            <AlertTriangle size={24} />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                                                {bottleneck.junctionName}
                                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                                                    {bottleneck.junctionId}
                                                </span>
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-400 font-mono">
                                                Detected timestamp: <span className="text-cyan-300">{bottleneck.detectedAt}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="rounded-lg bg-rose-500/20 border border-rose-500/50 px-3 py-1.5 text-xs font-mono font-bold uppercase text-rose-300">
                                            SEVERITY: {bottleneck.severity}
                                        </span>
                                        <button className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase transition">
                                            Reroute Inflow
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 font-mono">
                                    <Info
                                        icon={CarFront}
                                        label="SURGE VOLUME"
                                        value={`${bottleneck.vehicleCount} vehicles`}
                                    />
                                    <Info
                                        icon={Gauge}
                                        label="VELOCITY DROP"
                                        value={`${bottleneck.averageSpeed} km/h`}
                                    />
                                    <Info
                                        icon={AlertTriangle}
                                        label="CONGESTION RATIO"
                                        value={`${bottleneck.congestionIndex}/100`}
                                    />
                                    <Info
                                        icon={Clock3}
                                        label="EST. QUEUE STACK"
                                        value={`${bottleneck.estimatedQueueLength} vehicles`}
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

interface InfoProps {
    icon: typeof CarFront;
    label: string;
    value: string;
}

function Info({ icon: Icon, label, value }: InfoProps) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            <div className="flex items-center gap-2 text-slate-400">
                <Icon size={15} className="text-cyan-400" />
                <span className="text-xs uppercase">{label}</span>
            </div>

            <p className="mt-2 font-bold text-slate-200 text-sm">
                {value}
            </p>
        </div>
    );
}

export default Bottlenecks;