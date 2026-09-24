import {
    Activity,
    Gauge,
    Route,
    TrendingDown,
    TrendingUp,
    BarChart3,
    Clock,
    Zap,
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import TrafficChart from "../components/dashboard/TrafficChart";
import { trafficRecords } from "../data/demoTrafficData";
import { useState } from "react";

function TrafficAnalytics() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const highestCongestion = Math.max(
        ...trafficRecords.map((record) => record.congestionIndex)
    );

    const highestVehicles = Math.max(
        ...trafficRecords.map((record) => record.vehicleCount)
    );

    const lowestSpeed = Math.min(
        ...trafficRecords.map((record) => record.avgSpeed)
    );

    return (
        <div className="flex h-screen w-full bg-[#07090e] text-slate-100 overflow-hidden font-sans">
            <Sidebar
                isOpen={sidebarOpen}
                isCollapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                onToggleCollapse={() =>
                    setSidebarCollapsed((previous) => !previous)
                }
            />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <Header onMenuClick={() => setSidebarOpen(true)} systemStatus="OPTIMAL" />

                <main className="p-4 sm:p-6 space-y-6 max-w-[1700px] w-full mx-auto">
                    {/* Hero Cyber Header Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 p-6 sm:p-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                        <div className="scanline"></div>

                        <div className="torn-tape -top-2 left-10 rotate-[-3deg]"></div>
                        <div className="torn-tape-cyan -bottom-2 right-14 rotate-[3deg]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                                        <BarChart3 className="w-3 h-3 text-cyan-400" />
                                        TEMPORAL FLOW METRICS
                                    </span>
                                    <span className="text-xs font-mono text-fuchsia-400">
                                        // 24H SYNCHRONIZED STREAM
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3">
                                    <Activity className="w-7 h-7 text-cyan-400" />
                                    FLOW DYNAMICS & TELEMETRY
                                </h1>
                                <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    Deep historical time-series diagnostics visualizing velocity deviations, saturation flow coefficients, and network-wide vehicle accumulation.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left">
                                    <span className="text-[10px] text-cyan-400 block font-semibold">PEAK SURGE</span>
                                    <span className="text-lg font-bold text-white">{highestVehicles} VEHICLES / MIN</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 font-mono">
                        <div className="collage-card rounded-2xl p-5 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase">PEAK DENSITY NODE</span>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="text-2xl font-black text-rose-400">{highestVehicles} veh</span>
                                <span className="text-xs text-rose-400/80">▲ Surge Phase</span>
                            </div>
                        </div>

                        <div className="collage-card rounded-2xl p-5 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase">MIN VELOCITY CHOKE</span>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="text-2xl font-black text-amber-400">{lowestSpeed} km/h</span>
                                <span className="text-xs text-amber-400/80">▼ Metro Interch.</span>
                            </div>
                        </div>

                        <div className="collage-card rounded-2xl p-5 border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase">MAX CONGESTION INDEX</span>
                            <div className="mt-2 flex items-baseline justify-between">
                                <span className="text-2xl font-black text-fuchsia-400">{highestCongestion}/100</span>
                                <span className="text-xs text-fuchsia-400/80">Critical Range</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="collage-card rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-mono font-bold text-sm text-cyan-200 tracking-wider uppercase">
                                MULTI-JUNCTION HOURLY FLOW PROFILE
                            </h3>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                                SENSORS ONLINE: 100%
                            </span>
                        </div>
                        <TrafficChart />
                    </div>

                    {/* Telemetry Log Table */}
                    <div className="collage-card rounded-2xl p-6 border border-slate-800 overflow-x-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider">
                                TELEMETRY STREAM LOG (RAW INGESTION)
                            </h3>
                            <span className="text-xs font-mono text-slate-400">
                                TOTAL SAMPLES: {trafficRecords.length}
                            </span>
                        </div>

                        <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="pb-3 px-3">TIMESTAMP</th>
                                    <th className="pb-3 px-3">VEHICLES</th>
                                    <th className="pb-3 px-3">VELOCITY</th>
                                    <th className="pb-3 px-3">DENSITY</th>
                                    <th className="pb-3 px-3">CONGESTION</th>
                                    <th className="pb-3 px-3">SATURATION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-850">
                                {trafficRecords.map((record, index) => (
                                    <tr key={index} className="hover:bg-slate-900/50 transition">
                                        <td className="py-2.5 px-3 text-cyan-300">{record.timestamp}</td>
                                        <td className="py-2.5 px-3 text-slate-200 font-bold">{record.vehicleCount}</td>
                                        <td className="py-2.5 px-3 text-slate-300">{record.avgSpeed} km/h</td>
                                        <td className="py-2.5 px-3 text-slate-300">{record.vehicleDensity}</td>
                                        <td className="py-2.5 px-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                record.congestionLevel === "Very High"
                                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                                    : record.congestionLevel === "High"
                                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                            }`}>
                                                {record.congestionLevel}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-slate-400">{record.saturationFlowRate} vph</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TrafficAnalytics;