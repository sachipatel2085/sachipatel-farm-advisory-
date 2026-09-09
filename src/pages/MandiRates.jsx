import { useState, useEffect, useCallback } from "react";
import { Store, TrendingUp, Scale, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";
import mandiService from "../services/mandiService";
import MandiStatsHeader from "../components/mandi/MandiStatsHeader";
import MandiFilters from "../components/mandi/MandiFilters";
import MarketRateCard from "../components/mandi/MarketRateCard";
import PriceTrendChart from "../components/mandi/PriceTrendChart";
import MarketComparison from "../components/mandi/MarketComparison";

export default function MandiRates() {
  const [activeTab, setActiveTab] = useState("rates"); // "rates" | "trends" | "compare"
  const [rates, setRates] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [summary, setSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ states: [], commodities: [], districtsByState: {} });
  const [userCrops, setUserCrops] = useState([]);
  const [myCropsActive, setMyCropsActive] = useState(false);

  // Active filters
  const [filters, setFilters] = useState({
    search: "",
    crop: "",
    state: "",
    district: "",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 12,
  });

  // Selected for Trends / Comparison tab transitions
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch filter options & user active crops on mount
  useEffect(() => {
    async function loadInitialMeta() {
      try {
        const [filterData, summaryData] = await Promise.all([
          mandiService.getFilters(),
          mandiService.getTodaySummary(),
        ]);
        setFilterOptions(filterData);
        setSummary(summaryData);
      } catch (err) {
        console.warn("Could not load initial filters:", err.message);
      }

      // Load user crops if logged in
      try {
        const cropsRes = await api.get("/crops");
        const active = (cropsRes.data || [])
          .filter((c) => c.status === "active")
          .map((c) => c.cropName);
        const unique = Array.from(new Set(active));
        setUserCrops(unique);
      } catch (e) {
        // User may not be logged in or has no crops yet; ignore
      }
    }

    loadInitialMeta();
  }, []);

  // 2. Load rates whenever filters change
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = { ...filters };

      // If My Crops filter is toggled and no specific crop is chosen, filter by first user crop or let server handle
      if (myCropsActive && userCrops.length > 0 && !queryParams.crop) {
        queryParams.search = userCrops[0]; // search by farmer's crop
      }

      const result = await mandiService.getRates(queryParams);
      setRates(result.rates || []);
      setPagination(result.pagination || { page: 1, limit: 12, total: 0, pages: 1 });
    } catch (err) {
      console.error("Error fetching mandi rates:", err);
      setError("Failed to load market rates. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, myCropsActive, userCrops]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // reset to page 1 on filter modification
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      crop: "",
      state: "",
      district: "",
      sortBy: "date",
      sortOrder: "desc",
      page: 1,
      limit: 12,
    });
    setMyCropsActive(false);
  };

  const handleToggleMyCrops = () => {
    if (!myCropsActive && userCrops.length > 0) {
      setMyCropsActive(true);
      setFilters((prev) => ({
        ...prev,
        crop: userCrops[0] || "",
        page: 1,
      }));
    } else {
      setMyCropsActive(false);
      setFilters((prev) => ({
        ...prev,
        crop: "",
        page: 1,
      }));
    }
  };

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await mandiService.syncRates(false);
      const [sum, filt] = await Promise.all([
        mandiService.getTodaySummary(),
        mandiService.getFilters(),
      ]);
      setSummary(sum);
      setFilterOptions(filt);
      await fetchRates();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectTrend = (cropName, marketName) => {
    setSelectedCrop(cropName);
    setSelectedMarket(marketName);
    setActiveTab("trends");
  };

  const handleCompare = (cropName, stateName) => {
    setSelectedCrop(cropName);
    setSelectedState(stateName);
    setActiveTab("compare");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Stats & Actions */}
      <MandiStatsHeader
        summary={summary}
        onRefresh={handleRefresh}
        syncing={syncing}
      />

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-700/80 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("rates")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
            activeTab === "rates"
              ? "border-emerald-500 text-emerald-400 bg-slate-800/60"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Store size={16} />
          <span>Live Mandi Rates</span>
          {pagination.total > 0 && (
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
              {pagination.total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("trends")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
            activeTab === "trends"
              ? "border-emerald-500 text-emerald-400 bg-slate-800/60"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <TrendingUp size={16} />
          <span>Price Trends & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("compare")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
            activeTab === "compare"
              ? "border-emerald-500 text-emerald-400 bg-slate-800/60"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scale size={16} />
          <span>Compare Mandis</span>
        </button>
      </div>

      {/* TAB 1: LIVE MANDI RATES */}
      {activeTab === "rates" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <MandiFilters
            filters={filters}
            options={filterOptions}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            userCrops={userCrops}
            myCropsActive={myCropsActive}
            onToggleMyCrops={handleToggleMyCrops}
          />

          {/* Results Area */}
          {error && (
            <div className="bg-rose-950/20 border border-rose-500/40 rounded-xl p-4 flex items-center gap-3 text-rose-300 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button
                onClick={fetchRates}
                className="ml-auto underline font-medium text-xs hover:text-rose-200"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 animate-pulse space-y-4"
                >
                  <div className="h-5 bg-slate-700/60 rounded w-1/2" />
                  <div className="h-8 bg-slate-700/60 rounded w-3/4" />
                  <div className="h-10 bg-slate-700/40 rounded w-full" />
                  <div className="h-4 bg-slate-700/40 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : rates.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-12 text-center space-y-3">
              <Store size={40} className="mx-auto text-slate-500" />
              <h3 className="text-lg font-semibold text-white">No Mandi Rates Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No market rate records matched your current filter criteria. Try searching for another crop or clearing filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Rate Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rates.map((rate) => (
                  <MarketRateCard
                    key={rate._id}
                    rate={rate}
                    onSelectTrend={handleSelectTrend}
                    onCompare={handleCompare}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/60 text-xs text-slate-400">
                  <div>
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-white">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    of <span className="font-semibold text-white">{pagination.total}</span> rates
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFilterChange("page", pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs px-2 font-medium">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => handleFilterChange("page", pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages}
                      className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: PRICE TRENDS & ANALYTICS */}
      {activeTab === "trends" && (
        <PriceTrendChart
          initialCrop={selectedCrop}
          initialMarket={selectedMarket}
          commodities={filterOptions.commodities}
        />
      )}

      {/* TAB 3: MARKET COMPARISON */}
      {activeTab === "compare" && (
        <MarketComparison
          initialCrop={selectedCrop}
          initialState={selectedState}
          commodities={filterOptions.commodities}
          states={filterOptions.states}
        />
      )}
    </div>
  );
}
