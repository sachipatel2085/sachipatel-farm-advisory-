import React from "react";
import { Cpu, Database } from "lucide-react";

export default function AdminDiagnostics({ systemTelemetry = {}, kpis = {} }) {
  const uptimeMinutes = Math.floor((systemTelemetry.serverUptimeSec || 3600) / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeDays = Math.floor(uptimeHours / 24);

  const formatUptime = () => {
    if (uptimeDays > 0) return `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m`;
    if (uptimeHours > 0) return `${uptimeHours}h ${uptimeMinutes % 60}m`;
    return `${uptimeMinutes} minutes`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* RUNTIME TELEMETRY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Cpu size={18} className="text-emerald-400" />
          Runtime Telemetry
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Node.js Engine:</span>
            <span className="font-mono text-white">
              {systemTelemetry.nodeVersion || "v20.x"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Process Memory (Heap):</span>
            <span className="font-mono text-emerald-400">
              {systemTelemetry.memoryHeapUsedMb || 45} MB
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Process Uptime:</span>
            <span className="font-mono text-white">{formatUptime()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Environment Mode:</span>
            <span className="font-mono uppercase text-teal-400">
              {systemTelemetry.environment || "production"}
            </span>
          </div>
        </div>
      </div>

      {/* DATABASE CONNECTIVITY */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Database size={18} className="text-emerald-400" />
          Database Connectivity
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">MongoDB Status:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {systemTelemetry.databaseState || "Connected"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Active Database:</span>
            <span className="font-mono text-white">
              {systemTelemetry.dbName || "smartfarm"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Registered Farm Holdings:</span>
            <span className="font-mono text-white">
              {kpis.totalFarms || 0} Farms
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Active Monitored Acreage:</span>
            <span className="font-mono text-white">
              {kpis.totalAcreage || 0} Acres
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
