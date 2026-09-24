import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  category?: string;
  code?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  category = "TELEMETRY",
  code = "0x2A4",
}) => {
  return (
    <div className="collage-card p-4 rounded-xl relative overflow-hidden group">
      {/* Scanline overlay */}
      <div className="scanline"></div>

      {/* Retro blueprint corner bracket */}
      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-cyan-400/60"></div>
      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-cyan-400/60"></div>
      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-cyan-400/60"></div>
      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-cyan-400/60"></div>

      {/* Top Header Row with Technical Monospace Tag */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-semibold tracking-wider">
          {category} // {code}
        </span>
        <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="mb-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white group-hover:text-cyan-200 transition">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
          {title}
        </div>
      </div>

      {/* Footer Comparison / Subtitle */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
        {change && (
          <span
            className={`font-bold flex items-center gap-1 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? "▲" : "▼"} {change}
          </span>
        )}
        {subtitle && (
          <span className="text-slate-500 text-[10px] truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;