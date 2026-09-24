import React, { useState, useEffect } from "react";
import {
  Car,
  Activity,
  Zap,
  TrendingDown,
  Clock,
  Radio,
  Eye,
  Crosshair,
  Maximize2,
  Sliders,
  ChevronRight,
  BrainCircuit,
  Cpu,
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import TrafficChart from "../components/dashboard/TrafficChart";
import TrafficMap from "../components/map/TrafficMap";
import CongestionCard from "../components/traffic/CongestionCard";
import SignalCard from "../components/traffic/SignalCard";
import { predictTraffic } from "../services/api";
import type { TrafficPrediction } from "../types/traffic";

import {
  trafficConditions,
  bottlenecks,
  signalRecommendations,
} from "../data/demoTrafficData";

export const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedJunction, setSelectedJunction] = useState<string>("J-001");
  const [predictions, setPredictions] = useState<Record<string, TrafficPrediction>>({});
  const [isLoadingPredictions, setIsLoadingPredictions] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMLPredictions() {
      setIsLoadingPredictions(true);
      setPredictionError(null);
      const results: Record<string, TrafficPrediction> = {};

      for (const item of trafficConditions) {
        try {
          const pred = await predictTraffic({
            junctionId: item.junctionId,
            junctionName: item.junctionName,
            vehicleCount: item.vehicleCount,
            averageSpeed: item.averageSpeed,
            density: item.density,
            congestionIndex: item.congestionIndex,
          });
          if (isMounted) {
            results[item.junctionId] = pred;
          }
        } catch (err: any) {
          console.error(`Prediction failed for junction ${item.junctionId}:`, err);
          if (isMounted) {
            setPredictionError(err?.message || "Failed to load ML predictions");
          }
        }
      }

      if (isMounted) {
        setPredictions(results);
        setIsLoadingPredictions(false);
      }
    }

    loadMLPredictions();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePrediction = predictions[selectedJunction] || Object.values(predictions)[0];


  return (
    <div className="flex h-screen w-full bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Futuristic Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} systemStatus="OPTIMAL" />

        {/* Dashboard Canvas Container */}
        <main className="p-4 sm:p-6 space-y-6 max-w-[1700px] w-full mx-auto">
          {/* Top Hero Collage Banner with the generated cyber artwork */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-2xl">
            {/* Background Image Overlay with blueprint blend */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
              style={{ backgroundImage: `url('/assets/collage_bg.jpg')` }}
            ></div>
            
            {/* Cyber Gradient Grids & Scanlines */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
            <div className="scanline"></div>

            {/* Collage Floating Tape Decal */}
            <div className="torn-tape -top-2 left-10 rotate-[-4deg]"></div>
            <div className="torn-tape-cyan -bottom-2 right-16 rotate-[3deg]"></div>

            <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold tracking-widest uppercase">
                    COLLAGE ART GRID 2049
                  </span>
                  <span className="text-xs font-mono text-fuchsia-400">
                    // REAL-TIME AI NEURAL FLOW
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-mono">
                  NEO-METROPOLIS TRAFFIC CONTROL
                </h1>
                <p className="text-sm text-slate-300/90 leading-relaxed font-sans">
                  Deep reinforcement learning orchestration for autonomous junction flow, dynamic multi-modal congestion redistribution, and greenhouse emission dampening.
                </p>
              </div>

              {/* Quick Action Matrix Buttons & ML Status */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left font-mono">
                  <span className="text-[10px] text-cyan-400 block flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                    LIVE ML PREDICTION // {activePrediction?.junctionId || selectedJunction}
                  </span>
                  <span className="text-xl font-bold text-white">
                    {isLoadingPredictions
                      ? "INFERRING..."
                      : activePrediction
                      ? `${activePrediction.predictedClass?.toUpperCase()} (${activePrediction.predictedCongestionScore}%)`
                      : "STANDBY"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left font-mono hidden sm:block">
                  <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-emerald-400" />
                    MODEL BACKEND
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {activePrediction?.model?.name || "RandomForest (100 Trees)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Monitored Vehicles"
              value="463 / min"
              change="12% from avg"
              isPositive={false}
              icon={Car}
              category="FLOW DENSITY"
              code="0x11"
              subtitle="4 Intersections Active"
            />
            <StatCard
              title="Average Network Speed"
              value="27.5 km/h"
              change="8.4% faster"
              isPositive={true}
              icon={Activity}
              category="VELOCITY"
              code="0x24"
              subtitle="Fluid arterial condition"
            />
            <StatCard
              title="CO2 Emitted Saved"
              value="18.4 kg/hr"
              change="21% reduced"
              isPositive={true}
              icon={TrendingDown}
              category="EMISSIONS"
              code="0x89"
              subtitle="Target: 25 kg/hr"
            />
            <StatCard
              title="Active Critical Bottlenecks"
              value="1 Detected"
              change="J-03 Interch."
              isPositive={false}
              icon={Clock}
              category="RADAR ALERT"
              code="0xAA"
              subtitle="Intervention recommended"
            />
          </div>

          {/* Main Grid: Interactive Map + Analytics Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Traffic Map View */}
            <div className="lg:col-span-8 collage-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-mono font-bold text-sm text-cyan-200 tracking-wider uppercase">
                    ISOMETRIC JUNCTION TELEMETRY MAP
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> NORMAL
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> BOTTLENECK
                  </span>
                </div>
              </div>

              {/* Map Canvas Component */}
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <TrafficMap />
              </div>
            </div>

            {/* Side Column: Dynamic Flow Chart & Intersections */}
            <div className="lg:col-span-4 space-y-6">
              {/* Real-time Velocity / Flow Chart */}
              <div className="collage-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono font-bold text-sm text-cyan-200 tracking-wider uppercase">
                    TEMPORAL VELOCITY DYNAMICS
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                    24H WINDOW
                  </span>
                </div>
                <TrafficChart />
              </div>

              {/* Live Adaptive Signal Recommendations */}
              <div className="collage-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono font-bold text-sm text-fuchsia-300 tracking-wider uppercase">
                    AI SIGNAL OPTIMIZATION
                  </h3>
                  <span className="text-[10px] font-mono text-fuchsia-400 bg-fuchsia-950/60 px-2 py-0.5 rounded border border-fuchsia-500/30">
                    ACTIVE
                  </span>
                </div>
                <div className="space-y-3">
                  {signalRecommendations.slice(0, 2).map((rec) => (
                    <SignalCard key={rec.junctionId} recommendation={rec} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lower Grid: Bottleneck radar & Monitored Node Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trafficConditions.map((condition) => (
              <CongestionCard
                key={condition.junctionId}
                condition={condition}
                prediction={predictions[condition.junctionId]}
                isLoading={isLoadingPredictions}
                onSelect={(id) => setSelectedJunction(id)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;