import {
    Car,
    Cloud,
    Droplets,
    Fuel,
    Leaf,
    Volume2,
    TreePine,
    Sparkles,
    ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function Sustainability() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                    {/* Hero Cyber Banner */}
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-900 p-6 sm:p-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                        <div className="scanline"></div>

                        <div className="torn-tape -top-2 left-10 rotate-[-2deg]"></div>
                        <div className="torn-tape-cyan -bottom-2 right-16 rotate-[4deg]"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-1.5">
                                        <Leaf className="w-3 h-3 text-emerald-400" />
                                        GREEN ECO-CORRIDOR TELEMETRY
                                    </span>
                                    <span className="text-xs font-mono text-cyan-400">
                                        // CARBON OFFSET MATRIX 2049
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-3">
                                    <TreePine className="w-7 h-7 text-emerald-400" />
                                    SUSTAINABILITY & EMISSIONS INDEX
                                </h1>
                                <p className="max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                    Heuristic environmental modeling measuring real-world fuel reduction, carbon dioxide offset, and acoustic decibel suppression through adaptive corridor control.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 font-mono text-xs">
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-left">
                                    <span className="text-[10px] text-emerald-400 block font-semibold">TOTAL OFFSET</span>
                                    <span className="text-lg font-bold text-white">412.5 KG CO₂ / DAY</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Impact Metric Cards */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 font-mono">
                        <ImpactCard
                            icon={Fuel}
                            title="FUEL PRESERVED"
                            value="18.4%"
                            description="Adaptive wave routing"
                            code="0xFL"
                            color="emerald"
                        />
                        <ImpactCard
                            icon={Cloud}
                            title="CO₂ DAMPENING"
                            value="-21.2%"
                            description="Idle friction mitigation"
                            code="0xCO2"
                            color="cyan"
                        />
                        <ImpactCard
                            icon={Car}
                            title="IDLE LATENCY CUT"
                            value="-34.5m"
                            description="Network-wide average"
                            code="0xIDL"
                            color="amber"
                        />
                        <ImpactCard
                            icon={Volume2}
                            title="NOISE SUPPRESSION"
                            value="58 dB"
                            description="Low acoustic hazard"
                            code="0xDB"
                            color="fuchsia"
                        />
                    </div>

                    {/* Environmental Details Grid */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="collage-card rounded-2xl p-6 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-emerald-400">
                                    <Leaf size={22} />
                                </div>

                                <div>
                                    <h2 className="font-mono font-bold text-white text-base">
                                        ECOLOGICAL EFFICIENCY VECTOR
                                    </h2>
                                    <p className="text-xs text-slate-400 font-mono">
                                        Empirical measurements vs baseline unregulated traffic
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                <ProgressItem
                                    label="Thermal Fuel Efficiency Gain"
                                    value={78}
                                    text="18.4% verified savings"
                                    accentColor="bg-emerald-400"
                                />
                                <ProgressItem
                                    label="Atmospheric CO₂ Abatement"
                                    value={84}
                                    text="21.2% measured reduction"
                                    accentColor="bg-cyan-400"
                                />
                                <ProgressItem
                                    label="Micro-Stop & Idle Delay Avoidance"
                                    value={89}
                                    text="34.5 minutes eliminated per commute cycle"
                                    accentColor="bg-fuchsia-400"
                                />
                                <ProgressItem
                                    label="Acoustic Decibel Resonance Control"
                                    value={68}
                                    text="Target below 65 dB achieved in 88% of zones"
                                    accentColor="bg-amber-400"
                                />
                            </div>
                        </div>

                        <div className="collage-card rounded-2xl p-6 border border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-3 text-cyan-400">
                                    <Droplets size={22} />
                                </div>

                                <div>
                                    <h2 className="font-mono font-bold text-white text-base">
                                        UN SDG SUSTAINABILITY TARGETS
                                    </h2>
                                    <p className="text-xs text-slate-400 font-mono">
                                        Direct alignment with 2030 smart metropolis directives
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 font-mono text-xs">
                                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="font-bold text-cyan-400 uppercase">
                                        SDG 9 // RESILIENT INFRASTRUCTURE
                                    </p>
                                    <p className="mt-1 text-slate-300 font-sans leading-relaxed">
                                        Dynamic automated signal infrastructure reducing arterial bottlenecks and extending roadway longevity.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="font-bold text-emerald-400 uppercase">
                                        SDG 11 // SUSTAINABLE CITIES & HABITAT
                                    </p>
                                    <p className="mt-1 text-slate-300 font-sans leading-relaxed">
                                        Decentralized multi-modal eco-routing prioritizing green corridors away from high-density school and hospital zones.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                                    <p className="font-bold text-fuchsia-400 uppercase">
                                        SDG 13 // CLIMATE MITIGATION MATRIX
                                    </p>
                                    <p className="mt-1 text-slate-300 font-sans leading-relaxed">
                                        Aggressive reduction of unburned hydrocarbon exhaust and particulate matter across metro arterial networks.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

interface ImpactCardProps {
    icon: typeof Fuel;
    title: string;
    value: string;
    description: string;
    code: string;
    color: string;
}

function ImpactCard({
    icon: Icon,
    title,
    value,
    description,
    code,
    color,
}: ImpactCardProps) {
    return (
        <div className="collage-card rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    ECO::{code}
                </span>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                    <Icon size={18} />
                </div>
            </div>

            <div className="mt-4">
                <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
                <p className="mt-1 text-xs font-bold text-slate-300 uppercase">{title}</p>
                <p className="mt-1 text-[11px] text-slate-400 font-sans">{description}</p>
            </div>
        </div>
    );
}

interface ProgressItemProps {
    label: string;
    value: number;
    text: string;
    accentColor: string;
}

function ProgressItem({ label, value, text, accentColor }: ProgressItemProps) {
    return (
        <div>
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-400">{text}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                    className={`h-full ${accentColor} transition-all duration-500`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
}

export default Sustainability;