import React from "react";
import {
  Bell,
  Search,
  Activity,
  Cpu,
  Layers,
  Terminal,
  Radio,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onMenuClick?: () => void;
  systemStatus?: "OPTIMAL" | "CONGESTED" | "CRITICAL";
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onMenuClick,
  systemStatus = "OPTIMAL",
}) => {
  const handleToggle = onMenuClick || onToggleSidebar;
  return (
    <header className="relative w-full border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3 z-30">
      {/* Decorative cybernetic tape decal */}
      <div className="torn-tape -top-2 right-48 rotate-2 hidden md:block"></div>
      
      <div className="flex items-center justify-between gap-4">
        {/* Left: Terminal Matrix Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/40 text-[11px] font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wider">MATRIX::GRID-2049</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              AI NEURAL OPTIMIZER v3.4
            </span>
          </div>
        </div>

        {/* Center: Search / Query input styled as schematic prompt */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-cyan-500/60" />
            <input
              type="text"
              placeholder="SEARCH NODE / JUNCTION_ID / ECO_ROUTE..."
              className="w-full pl-9 pr-4 py-1.5 rounded bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 text-xs font-mono text-cyan-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
            <span className="absolute right-2.5 top-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              ⌘K
            </span>
          </div>
        </div>

        {/* Right: Telemetry status badge & user avatar */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                TELEMETRY
              </span>
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {systemStatus}
              </span>
            </div>
          </div>

          {/* Quick Notification trigger */}
          <button className="relative p-2 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
          </button>

          {/* Urban AI badge / Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="relative w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-fuchsia-600 p-[1px] shadow-sm">
              <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></div>
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 font-mono tracking-tight">OPERATOR_09</span>
              <span className="text-[10px] text-cyan-400/80 font-mono">NEO_METRO_AUTH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;