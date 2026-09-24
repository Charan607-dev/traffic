import { useState } from "react";
import RoutePlanner from "../components/routes/RoutePlanner";
import RouteComparison from "../components/routes/RouteComparison";
import TrafficMap from "../components/map/TrafficMap";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Navigation, Compass, Sparkles, ShieldCheck } from "lucide-react";

function RoutePlannerPage() {
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
                    {/* Header Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 p-6 sm:p-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                        <div className="scanline"></div>

                        <div className="torn-tape -top-2 left-12 rotate-[-2deg]"></div>
                        <div className="torn-tape-cyan -bottom-2 right-12 rotate-[4deg]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
                                        NEURAL ROUTING MATRIX
                                    </span>
                                    <span className="text-xs font-mono text-emerald-400">
                                        // EMISSIONS OPTIMIZER ACTIVE
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3">
                                    <Navigation className="w-7 h-7 text-cyan-400" />
                                    MULTI-MODAL ROUTE PLANNER
                                </h1>
                                <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    Dynamic heuristic route discovery comparing real-time flow density, idle friction delays, acoustic noise metrics, and fuel carbon footprint.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left">
                                    <span className="text-[10px] text-cyan-400 block">LOWEST EMISSIONS</span>
                                    <span className="text-base font-bold text-emerald-400">-28% CO2 PROFILE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Routing form widget */}
                    <div className="collage-card rounded-2xl p-5 border border-slate-800">
                        <RoutePlanner />
                    </div>

                    {/* Interactive Telemetry & Google Map Corridor */}
                    <div className="collage-card rounded-2xl p-5 border border-slate-800">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Compass className="w-5 h-5 text-cyan-400" />
                                <h3 className="font-mono font-bold text-sm text-cyan-200 tracking-wider uppercase">
                                    GEOSPATIAL ROUTE CORRIDOR & TELEMETRY
                                </h3>
                            </div>
                        </div>
                        <TrafficMap />
                    </div>

                    {/* Route Comparison Matrix */}
                    <div className="collage-card rounded-2xl p-5 border border-slate-800">
                        <RouteComparison />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default RoutePlannerPage;