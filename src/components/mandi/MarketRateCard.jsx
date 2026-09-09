import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, ArrowRight } from "lucide-react";

export default function MarketRateCard({ rate, onSelectTrend, onCompare }) {
  const isPositive = rate.priceChange > 0;
  const isNegative = rate.priceChange < 0;

  const formattedDate = new Date(rate.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl p-5 transition-all duration-200 shadow-lg hover:shadow-emerald-950/20 flex flex-col justify-between group">
      <div>
        {/* Top bar: Commodity + Price Change Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {rate.crop}
              </h3>
              {rate.variety && rate.variety !== "Standard" && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                  {rate.variety}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{rate.commodity}</p>
          </div>

          {/* Daily Price Change */}
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isNegative
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-slate-700/50 text-slate-400 border-slate-600/30"
            }`}
          >
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}
            {!isPositive && !isNegative && <Minus size={12} />}
            <span>
              {isPositive ? `+₹${rate.priceChange}` : isNegative ? `-₹${Math.abs(rate.priceChange)}` : "₹0"}
            </span>
          </div>
        </div>

        {/* Modal Price Highlight */}
        <div className="my-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Modal Price</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-extrabold text-emerald-400">
              ₹{rate.modalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-medium text-slate-400">{rate.unit}</span>
          </div>

          {/* Min - Max Range bar */}
          <div className="mt-3 bg-slate-900/70 rounded-lg p-2.5 border border-slate-700/50">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Min: ₹{rate.minPrice.toLocaleString("en-IN")}</span>
              <span>Max: ₹{rate.maxPrice.toLocaleString("en-IN")}</span>
            </div>
            {/* Visual range track */}
            <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      15,
                      rate.maxPrice > rate.minPrice
                        ? ((rate.modalPrice - rate.minPrice) / (rate.maxPrice - rate.minPrice)) * 100
                        : 50
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Location & Metadata */}
        <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-700/40">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate">{rate.market}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pl-4 text-[11px]">
            <span>{rate.district}, {rate.state}</span>
            <div className="flex items-center gap-1">
              <Calendar size={11} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex gap-2">
        {onSelectTrend && (
          <button
            onClick={() => onSelectTrend(rate.crop, rate.market)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 px-2.5 rounded-lg bg-slate-700/60 hover:bg-emerald-600 text-slate-200 hover:text-white transition-colors"
          >
            <span>Trend</span>
            <ArrowRight size={12} />
          </button>
        )}
        {onCompare && (
          <button
            onClick={() => onCompare(rate.crop, rate.state)}
            className="flex-1 flex items-center justify-center gap-1 text-xs font-medium py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
          >
            <span>Compare</span>
          </button>
        )}
      </div>
    </div>
  );
}
