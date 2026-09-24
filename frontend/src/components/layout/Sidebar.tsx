import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Navigation,
  BarChart3,
  AlertOctagon,
  SlidersHorizontal,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Flame,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      to: "/",
      label: "COMMAND MATRIX",
      sub: "Citywide Overview",
      icon: LayoutDashboard,
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      to: "/route-planner",
      label: "NEURAL ROUTING",
      sub: "Eco & Fast Paths",
      icon: Navigation,
      badge: "AI",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      to: "/traffic-analytics",
      label: "FLOW TELEMETRY",
      sub: "Historical Dynamics",
      icon: BarChart3,
    },
    {
      to: "/bottlenecks",
      label: "BOTTLENECK RADAR",
      sub: "Anomaly Detection",
      icon: AlertOctagon,
      badge: "WARN",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    },
    {
      to: "/signal-optimization",
      label: "ADAPTIVE SIGNALS",
      sub: "Dynamic Timing AI",
      icon: SlidersHorizontal,
      badge: "SYNC",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      to: "/sustainability",
      label: "ECO & EMISSIONS",
      sub: "CO2 & Fuel Metrics",
      icon: Leaf,
      badge: "ECO",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <aside
      className={`relative z-40 flex flex-col h-screen border-r border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Decorative vintage tape on corner */}
      <div className="torn-tape -top-2 left-6 rotate-3"></div>

      {/* Brand Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center font-black text-cyan-300 font-mono text-lg">
                Ω
              </div>
            </div>
            <div>
              <h1 className="font-extrabold tracking-wider text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-pink-400 font-mono">
                URBAN.AI
              </h1>
              <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
                MATRIX ED. 2049
              </p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-9 h-9 rounded bg-gradient-to-tr from-cyan-500 to-pink-500 p-[1.5px] flex items-center justify-center font-mono font-bold text-cyan-300">
            Ω
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 group relative ${
                  isActive
                    ? "bg-cyan-950/60 border-cyan-400/80 text-cyan-200 shadow-[0_0_15px_rgba(0,243,255,0.15)]"
                    : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:border-slate-700"
                }`
              }
            >
              {/* Highlight accent bar */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-3/4 bg-cyan-400 transition-all rounded-r"></div>

              <Icon className="w-5 h-5 flex-shrink-0 text-cyan-400 group-hover:text-cyan-300" />

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wide truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-semibold ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate font-mono">
                    {item.sub}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Blueprint Schematic Widget at bottom */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-lg blueprint-badge text-[11px] relative overflow-hidden">
          <div className="flex items-center gap-1.5 mb-1 text-cyan-300 font-bold">
            <Cpu className="w-3.5 h-3.5 animate-spin" />
            <span>NEO-GRID STATUS</span>
          </div>
          <p className="text-[10px] text-cyan-200/70 leading-relaxed font-mono">
            SEC C-4 // OPTIMIZED 98.4%<br />
            REDUCED IDLE: -24.2 MIN
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;