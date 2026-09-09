import { Store, Sprout, TrendingUp, RefreshCw, CheckCircle2 } from "lucide-react";

export default function MandiStatsHeader({ summary, onRefresh, syncing }) {
  const topGainer = summary?.topGainers?.[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Store className="text-emerald-400" size={28} />
            Mandi & Market Rates
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time APMC auction prices, daily price trends, and mandi comparison for your crops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            disabled={syncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            title="Refresh market rates"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin text-emerald-400" : "text-slate-400"} />
            <span>{syncing ? "Updating..." : "Refresh Rates"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Store size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Mandis Tracked</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {summary?.totalMarkets || "17+"}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Sprout size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Commodities</div>
            <div className="text-xl font-bold text-white mt-0.5">
              {summary?.totalCommodities || "11+"}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
            <TrendingUp size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-400 truncate">Top Gainer Today</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 truncate">
              {topGainer ? `${topGainer.crop} (+₹${topGainer.priceChange})` : "Active"}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">APMC Portal Status</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Rates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
