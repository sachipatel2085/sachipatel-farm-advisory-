import { Search, X, Filter, Sparkles } from "lucide-react";

export default function MandiFilters({
  filters,
  options,
  onChange,
  onReset,
  userCrops = [],
  myCropsActive = false,
  onToggleMyCrops,
}) {
  const availableDistricts = filters.state
    ? options.districtsByState?.[filters.state] || []
    : [];

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Bar: Search + My Crops Shortcut */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onChange("search", e.target.value)}
            placeholder="Search crop, mandi, district or state (e.g. Tomato, Gondal, Anand)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* My Crops quick toggle */}
        {userCrops.length > 0 && (
          <button
            onClick={onToggleMyCrops}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
              myCropsActive
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/30"
                : "bg-slate-900/90 text-emerald-400 hover:bg-emerald-950/30 border-emerald-500/40"
            }`}
          >
            <Sparkles size={16} />
            <span>My Farm Crops ({userCrops.length})</span>
          </button>
        )}
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Commodity / Crop Select */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Crop / Commodity
          </label>
          <select
            value={filters.crop || ""}
            onChange={(e) => onChange("crop", e.target.value)}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All Commodities</option>
            {options.commodities?.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* State Select */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            State
          </label>
          <select
            value={filters.state || ""}
            onChange={(e) => {
              onChange("state", e.target.value);
              onChange("district", ""); // reset district when state changes
            }}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">All States</option>
            {options.states?.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* District Select */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            District {filters.state ? `(${filters.state})` : ""}
          </label>
          <select
            value={filters.district || ""}
            onChange={(e) => onChange("district", e.target.value)}
            disabled={!filters.state}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">All Districts</option>
            {availableDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Sort Order
          </label>
          <select
            value={`${filters.sortBy || "date"}_${filters.sortOrder || "desc"}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split("_");
              onChange("sortBy", sortBy);
              onChange("sortOrder", sortOrder);
            }}
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="date_desc">Latest Date</option>
            <option value="modalPrice_desc">Highest Price First</option>
            <option value="modalPrice_asc">Lowest Price First</option>
            <option value="crop_asc">Crop Name (A-Z)</option>
            <option value="market_asc">Mandi Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Active filters pill list & Reset button */}
      {(filters.search || filters.crop || filters.state || filters.district || myCropsActive) && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter size={12} /> Active:
            </span>
            {myCropsActive && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                My Farm Crops
              </span>
            )}
            {filters.crop && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                Crop: {filters.crop}
              </span>
            )}
            {filters.state && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                State: {filters.state}
              </span>
            )}
            {filters.district && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                District: {filters.district}
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                Search: "{filters.search}"
              </span>
            )}
          </div>

          <button
            onClick={onReset}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
