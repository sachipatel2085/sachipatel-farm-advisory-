import { useState, useEffect } from "react";
import { Award, ArrowDownRight, ArrowUpRight, Scale, AlertCircle } from "lucide-react";
import mandiService from "../../services/mandiService";

export default function MarketComparison({
  initialCrop = "Wheat",
  initialState = "",
  commodities = [],
  states = [],
}) {
  const [crop, setCrop] = useState(initialCrop);
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    if (initialCrop) setCrop(initialCrop);
    if (initialState) setState(initialState);
  }, [initialCrop, initialState]);

  useEffect(() => {
    let isMounted = true;

    async function loadComparison() {
      if (!crop) return;
      setLoading(true);
      try {
        const data = await mandiService.getComparison(crop, state);
        if (isMounted) {
          setComparison(data);
        }
      } catch (err) {
        console.error("Failed to load comparison:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadComparison();

    return () => {
      isMounted = false;
    };
  }, [crop, state]);

  const highest = comparison?.highestMarket;
  const lowest = comparison?.lowestMarket;
  const average = comparison?.averagePrice || 0;
  const ranked = comparison?.rankedMarkets || [];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-lg space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="text-emerald-400" size={22} />
            Mandi Price Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare auction prices across different APMC mandis to maximize your crop revenue
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Crop Selector */}
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {commodities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* State Selector */}
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex items-center justify-center text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing market spreads...</span>
          </div>
        </div>
      ) : !ranked.length ? (
        <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-sm">
          <AlertCircle size={28} className="text-slate-500 mb-1" />
          <p>No active mandis found for {crop} in selected location.</p>
        </div>
      ) : (
        <>
          {/* Key Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Best Mandi */}
            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span className="flex items-center gap-1">
                  <Award size={14} /> Highest Paying Mandi
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                  Best Return
                </span>
              </div>
              <div className="mt-2 text-xl font-extrabold text-white">
                ₹{highest?.modalPrice?.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-slate-400">/ Qtl</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1 truncate">
                {highest?.market}
              </div>
              <div className="text-[11px] text-slate-400">
                {highest?.district}, {highest?.state}
              </div>
            </div>

            {/* Lowest Mandi */}
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                <span className="flex items-center gap-1">
                  <ArrowDownRight size={14} /> Lowest Rate Mandi
                </span>
              </div>
              <div className="mt-2 text-xl font-extrabold text-white">
                ₹{lowest?.modalPrice?.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-slate-400">/ Qtl</span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1 truncate">
                {lowest?.market}
              </div>
              <div className="text-[11px] text-slate-400">
                {lowest?.district}, {lowest?.state}
              </div>
            </div>

            {/* Market Spread & Opportunity */}
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  Market Price Spread
                </div>
                <div className="mt-2 text-xl font-extrabold text-amber-400">
                  ₹{comparison?.priceSpread?.toLocaleString("en-IN")}{" "}
                  <span className="text-xs text-slate-400 font-medium">
                    ({comparison?.spreadPercentage}% spread)
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Average benchmark: <span className="text-white font-semibold">₹{average?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Ranked Mandis Table / List */}
          <div className="overflow-x-auto rounded-lg border border-slate-700/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-700/60 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Rank & Mandi</th>
                  <th className="py-3 px-3.5">Location</th>
                  <th className="py-3 px-3.5">Modal Price</th>
                  <th className="py-3 px-3.5">Min - Max</th>
                  <th className="py-3 px-3.5">vs Benchmark</th>
                  <th className="py-3 px-3.5 hidden md:table-cell">Price Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {ranked.map((item, idx) => {
                  const diff = item.modalPrice - average;
                  const percentOfMax = highest?.modalPrice
                    ? Math.round((item.modalPrice / highest.modalPrice) * 100)
                    : 100;

                  return (
                    <tr
                      key={`${item.market}_${idx}`}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="py-3 px-3.5 font-medium text-white flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? "bg-amber-400 text-slate-950"
                              : idx === 1
                              ? "bg-slate-300 text-slate-950"
                              : idx === 2
                              ? "bg-amber-700 text-white"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="truncate">{item.market}</span>
                      </td>

                      <td className="py-3 px-3.5 text-slate-400">
                        {item.district}, {item.state}
                      </td>

                      <td className="py-3 px-3.5 font-bold text-emerald-400 text-sm">
                        ₹{item.modalPrice.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3 px-3.5 text-slate-400">
                        ₹{item.minPrice} - ₹{item.maxPrice}
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            diff > 0
                              ? "text-emerald-400"
                              : diff < 0
                              ? "text-rose-400"
                              : "text-slate-400"
                          }`}
                        >
                          {diff > 0 ? (
                            <ArrowUpRight size={13} />
                          ) : diff < 0 ? (
                            <ArrowDownRight size={13} />
                          ) : null}
                          {diff > 0 ? `+₹${diff}` : diff < 0 ? `-₹${Math.abs(diff)}` : "₹0"}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 hidden md:table-cell w-36">
                        <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${percentOfMax}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          {percentOfMax}% of top rate
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
