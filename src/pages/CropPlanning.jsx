import React, { useEffect, useState } from "react";
import cropPlanningService from "../services/cropPlanningService";
import Breadcrumb from "../components/Breadcrumb";
import {
  Compass,
  Repeat,
  Calculator,
  CalendarDays,
  Sprout,
  Droplets,
  Layers,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Info,
  Calendar,
  Sparkles,
  RefreshCw,
  Sliders,
  DollarSign,
} from "lucide-react";

export default function CropPlanning() {
  const [activeTab, setActiveTab] = useState("pre-sowing"); // "pre-sowing" | "rotation" | "cost-estimator" | "calendar"

  // 1. PRE-SOWING ADVISOR STATE
  const [preSowingForm, setPreSowingForm] = useState({
    season: "rabi",
    soilType: "loam",
    waterAvailability: "medium",
    acres: 2,
    budget: "",
    riskTolerance: "medium",
  });
  const [preSowingLoading, setPreSowingLoading] = useState(false);
  const [preSowingResults, setPreSowingResults] = useState(null);

  const fetchPreSowing = async () => {
    setPreSowingLoading(true);
    try {
      const data = await cropPlanningService.getPreSowingRecommendations(
        preSowingForm
      );
      setPreSowingResults(data);
    } catch (err) {
      console.error("Pre-sowing error:", err);
    } finally {
      setPreSowingLoading(false);
    }
  };

  // 2. CROP ROTATION STATE
  const [rotationForm, setRotationForm] = useState({
    currentCrop: "Cotton",
    nextSeason: "rabi",
  });
  const [rotationLoading, setRotationLoading] = useState(false);
  const [rotationResults, setRotationResults] = useState(null);

  const fetchRotation = async () => {
    setRotationLoading(true);
    try {
      const data = await cropPlanningService.getCropRotationPlan(rotationForm);
      setRotationResults(data);
    } catch (err) {
      console.error("Rotation error:", err);
    } finally {
      setRotationLoading(false);
    }
  };

  // 3. INPUT COST ESTIMATOR STATE
  const [costForm, setCostForm] = useState({
    cropName: "Wheat",
    acres: 2,
    customOverrides: {
      seedCost: 1800,
      fertilizerCost: 4500,
      pesticideCost: 1800,
      machineryCost: 3500,
      labourCost: 3000,
      irrigationCost: 1900,
    },
  });
  const [costLoading, setCostLoading] = useState(false);
  const [costResults, setCostResults] = useState(null);

  const fetchCostEstimate = async () => {
    setCostLoading(true);
    try {
      const data = await cropPlanningService.estimateInputCosts(costForm);
      setCostResults(data);
      if (data?.costPerAcre) {
        setCostForm((prev) => ({
          ...prev,
          customOverrides: {
            seedCost: data.costPerAcre.seeds,
            fertilizerCost: data.costPerAcre.fertilizers,
            pesticideCost: data.costPerAcre.pesticides,
            machineryCost: data.costPerAcre.machinery,
            labourCost: data.costPerAcre.labour,
            irrigationCost: data.costPerAcre.irrigation,
          },
        }));
      }
    } catch (err) {
      console.error("Cost estimate error:", err);
    } finally {
      setCostLoading(false);
    }
  };

  // 4. AGRONOMIC CALENDAR STATE
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarData, setCalendarData] = useState(null);

  const fetchCalendar = async () => {
    setCalendarLoading(true);
    try {
      const data = await cropPlanningService.getAgronomicCalendar();
      setCalendarData(data);
    } catch (err) {
      console.error("Calendar error:", err);
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "pre-sowing" && !preSowingResults) fetchPreSowing();
    if (activeTab === "rotation" && !rotationResults) fetchRotation();
    if (activeTab === "cost-estimator" && !costResults) fetchCostEstimate();
    if (activeTab === "calendar" && !calendarData) fetchCalendar();
  }, [activeTab]);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName="Crop Planning & Calendar" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Compass size={22} />
            </div>
            Crop Planning & Agronomic Calendar
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Pre-sowing decisions, scientific crop rotation, input cost estimation, and seasonal windows.
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("pre-sowing")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === "pre-sowing"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Compass size={16} /> Pre-Sowing Advisor
        </button>

        <button
          onClick={() => setActiveTab("rotation")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === "rotation"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Repeat size={16} /> Crop Rotation Planner
        </button>

        <button
          onClick={() => setActiveTab("cost-estimator")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === "cost-estimator"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calculator size={16} /> Input Cost Estimator
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            activeTab === "calendar"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <CalendarDays size={16} /> Agronomic Sowing Calendar
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRE-SOWING DECISION ADVISOR                                       */}
      {/* ========================================================================= */}
      {activeTab === "pre-sowing" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Sliders size={18} className="text-emerald-400" />
              Configure Farm Conditions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {/* Season */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Target Season</label>
                <select
                  value={preSowingForm.season}
                  onChange={(e) => setPreSowingForm({ ...preSowingForm, season: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="summer">Zaid (Summer)</option>
                </select>
              </div>

              {/* Soil */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Soil Type</label>
                <select
                  value={preSowingForm.soilType}
                  onChange={(e) => setPreSowingForm({ ...preSowingForm, soilType: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500 capitalize"
                >
                  <option value="loam">Loam / Sandy Loam</option>
                  <option value="black">Black Cotton Soil</option>
                  <option value="clay loam">Clay / Clay Loam</option>
                  <option value="alluvial">Alluvial Riverbed</option>
                  <option value="red">Red Loam</option>
                  <option value="sandy">Sandy Soil</option>
                </select>
              </div>

              {/* Water */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Water / Irrigation</label>
                <select
                  value={preSowingForm.waterAvailability}
                  onChange={(e) =>
                    setPreSowingForm({ ...preSowingForm, waterAvailability: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="medium">Medium (Canal / Tubewell)</option>
                  <option value="low">Low (Rainfed / Limited)</option>
                  <option value="high">High (Drip / Abundant)</option>
                </select>
              </div>

              {/* Farm Acres */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Land Area (Acres)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={preSowingForm.acres}
                  onChange={(e) => setPreSowingForm({ ...preSowingForm, acres: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Risk Tolerance */}
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Risk Profile</label>
                <select
                  value={preSowingForm.riskTolerance}
                  onChange={(e) =>
                    setPreSowingForm({ ...preSowingForm, riskTolerance: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="medium">Balanced</option>
                  <option value="low">Conservative (Low Risk)</option>
                  <option value="high">High Yield (Aggressive)</option>
                </select>
              </div>

              {/* Action Button */}
              <div className="flex items-end">
                <button
                  onClick={fetchPreSowing}
                  disabled={preSowingLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={14} className={preSowingLoading ? "animate-spin" : ""} />
                  Analyze
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {preSowingLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 border border-white/10" />
              ))}
            </div>
          ) : !preSowingResults || preSowingResults.recommendations?.length === 0 ? (
            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400 text-sm">No crops evaluated. Click Analyze to run recommendation engine.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <span>
                  Evaluated {preSowingResults.totalEvaluated} crops for{" "}
                  <strong className="text-white capitalize">{preSowingForm.season} Season</strong> on{" "}
                  <strong className="text-white">{preSowingForm.acres} Acres</strong>
                </span>
                <span className="text-emerald-400 font-medium">Ranked by Scientific Synergy & ROI</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {preSowingResults.recommendations.map((crop, idx) => (
                  <div
                    key={crop.cropName}
                    className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between backdrop-blur-sm ${
                      idx === 0
                        ? "border-emerald-500/50 bg-gradient-to-b from-emerald-950/20 to-slate-900 shadow-xl shadow-emerald-950/30"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                              <Sprout size={18} className="text-emerald-400" />
                              {crop.cropName}
                            </h4>
                            {idx === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                                Top Pick
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {crop.botanicalFamily} • {crop.durationDays} Days
                          </p>
                        </div>

                        {/* Suitability Badge */}
                        <div className="text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              crop.suitabilityScore >= 80
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {crop.suitabilityScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Sowing Window Pill */}
                      {crop.sowingWindow && (
                        <div className="mb-3 p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-300 flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Calendar size={12} className="text-emerald-400" />
                            Ideal Sowing:
                          </span>
                          <span className="font-medium text-white">{crop.sowingWindow}</span>
                        </div>
                      )}

                      {/* Key Financial Projection Box */}
                      <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-2 mb-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Net Profit ({crop.financials.acres} Ac):</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            ₹ {crop.financials.netProfit.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-gray-400">
                          <span>Profit per Acre:</span>
                          <span className="text-gray-200">
                            ₹ {crop.financials.profitPerAcre.toLocaleString("en-IN")}/ac
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-gray-400">
                          <span>Expected Yield:</span>
                          <span className="text-gray-200">
                            {crop.financials.expectedYieldTotal} {crop.financials.yieldUnit}s
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-gray-400">
                          <span>Est. Investment:</span>
                          <span className="text-gray-200">
                            ₹ {crop.financials.estimatedTotalCost.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Reasons & Synergy */}
                      {crop.reasons?.length > 0 && (
                        <div className="space-y-1 mb-3">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">
                            Key Agronomic Synergies:
                          </span>
                          {crop.reasons.map((r, i) => (
                            <div key={i} className="text-xs text-gray-300 flex items-start gap-1.5 leading-snug">
                              <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Quick Pre-sowing Pro Tips */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span className="capitalize">
                        Water: <strong className="text-gray-200">{crop.agronomy.waterRequirement}</strong>
                      </span>
                      <span>
                        Risk: <strong className="text-gray-200 capitalize">{crop.agronomy.riskLevel}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CROP ROTATION PLANNER                                             */}
      {/* ========================================================================= */}
      {activeTab === "rotation" && (
        <div className="space-y-6">
          {/* Rotation Selection Bar */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Repeat size={18} className="text-emerald-400" />
              Scientific Crop Succession & Disease Break
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Currently / Previously Planted Crop</label>
                <select
                  value={rotationForm.currentCrop}
                  onChange={(e) => setRotationForm({ ...rotationForm, currentCrop: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cotton">Cotton (Kharif Cash Crop)</option>
                  <option value="Paddy (Rice)">Paddy / Rice (Monsoon Cereal)</option>
                  <option value="Wheat">Wheat (Winter Cereal)</option>
                  <option value="Tomato">Tomato (Vegetable)</option>
                  <option value="Potato">Potato (Tuber Crop)</option>
                  <option value="Maize">Maize / Corn</option>
                  <option value="Soybean">Soybean (Legume)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Next Rotation Season</label>
                <select
                  value={rotationForm.nextSeason}
                  onChange={(e) => setRotationForm({ ...rotationForm, nextSeason: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="rabi">Rabi (Winter Season)</option>
                  <option value="summer">Zaid (Summer Catch Season)</option>
                  <option value="kharif">Kharif (Monsoon Season)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchRotation}
                  disabled={rotationLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Repeat size={14} className={rotationLoading ? "animate-spin" : ""} />
                  Generate Rotation Roadmap
                </button>
              </div>
            </div>
          </div>

          {rotationLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
              <div className="h-44 bg-white/5 rounded-2xl border border-white/10" />
            </div>
          ) : !rotationResults ? null : (
            <div className="space-y-6">
              {/* Annual 3-Season Roadmap Banner */}
              {rotationResults.annualRoadmap?.length > 0 && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-400" />
                    Recommended 3-Season Annual Rotation Cycle
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {rotationResults.annualRoadmap.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden"
                      >
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                          Step {idx + 1}: {step.season}
                        </span>
                        <p className="text-base font-bold text-white">{step.crop}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{step.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Successors Grid */}
              <div className="space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  Ideal Rotational Successors for {rotationResults.currentCrop}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rotationResults.recommendedSuccessors.map((cand) => (
                    <div
                      key={cand.cropName}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-base font-semibold text-white">{cand.cropName}</h5>
                          <p className="text-xs text-gray-400">
                            Family: {cand.botanicalFamily} • {cand.durationDays} Days
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                          {cand.rotationalScore}% Synergy
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                        <strong>Soil Health Benefit:</strong> {cand.soilHealthImpact}
                      </div>

                      {cand.benefits?.length > 0 && (
                        <div className="space-y-1 text-xs text-gray-300">
                          {cand.benefits.map((b, i) => (
                            <p key={i} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{b}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-gray-400">
                        <span>Expected Profit:</span>
                        <strong className="text-emerald-400">
                          ₹ {cand.avgProfitPerAcre.toLocaleString("en-IN")}/acre
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incompatible Crops Warning Box */}
              {rotationResults.incompatibleSuccessors?.length > 0 && (
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <h4 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-rose-400" />
                    Succession Hazards (Crops to Avoid Immediately After {rotationResults.currentCrop})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {rotationResults.incompatibleSuccessors.map((bad) => (
                      <div
                        key={bad.cropName}
                        className="p-3 rounded-xl bg-black/40 border border-rose-500/20 text-gray-300"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-rose-300">{bad.cropName}</span>
                          <span className="text-[10px] text-rose-400 uppercase font-bold">Monoculture Hazard</span>
                        </div>
                        {bad.warnings?.map((w, i) => (
                          <p key={i} className="text-gray-400 mt-1 leading-snug">
                            {w}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INPUT COST ESTIMATOR                                              */}
      {/* ========================================================================= */}
      {activeTab === "cost-estimator" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Calculator size={18} className="text-emerald-400" />
              Itemized Cultivation Budget & Break-Even Yield Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-medium">Select Crop</label>
                <select
                  value={costForm.cropName}
                  onChange={(e) => setCostForm({ ...costForm, cropName: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Potato">Potato</option>
                  <option value="Paddy (Rice)">Paddy / Rice</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Chickpea (Gram)">Chickpea (Gram)</option>
                  <option value="Green Gram (Moong)">Green Gram (Moong)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Land Area (Acres)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={costForm.acres}
                  onChange={(e) => setCostForm({ ...costForm, acres: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchCostEstimate}
                  disabled={costLoading}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={14} className={costLoading ? "animate-spin" : ""} />
                  Recalculate Budget
                </button>
              </div>
            </div>
          </div>

          {costLoading ? (
            <div className="h-64 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ) : !costResults ? null : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Itemized Cost Adjustment Column */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h4 className="font-semibold text-white text-sm">
                    Itemized Cost Inputs per Acre (₹)
                  </h4>
                  <span className="text-xs text-gray-400">Tweak values to match local market</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-gray-300 mb-1">Seeds & Nursery (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.seedCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            seedCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Fertilizers & Nutrients (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.fertilizerCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            fertilizerCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Pesticide & Spray Protection (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.pesticideCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            pesticideCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Machinery & Tractor Hire (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.machineryCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            machineryCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Manual Labour (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.labourCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            labourCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Irrigation, Pumping & Power (₹/ac)</label>
                    <input
                      type="number"
                      value={costForm.customOverrides.irrigationCost}
                      onChange={(e) =>
                        setCostForm({
                          ...costForm,
                          customOverrides: {
                            ...costForm.customOverrides,
                            irrigationCost: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end">
                  <button
                    onClick={fetchCostEstimate}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-white/10 transition"
                  >
                    Apply Custom Rates
                  </button>
                </div>
              </div>

              {/* Economic Summary & Break-Even Analysis */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900 border border-white/10 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-white text-sm pb-2 border-b border-white/10">
                    Financial Feasibility ({costResults.acres} Acres)
                  </h4>

                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Farm Investment:</span>
                      <strong className="text-rose-400">
                        ₹ {costResults.totalFarmCosts.grandTotal.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Gross Expected Income:</span>
                      <strong className="text-white">
                        ₹ {costResults.projections.grossIncome.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-white/5 text-sm">
                      <span className="text-gray-300 font-medium">Net Profit:</span>
                      <strong
                        className={`font-bold ${
                          costResults.projections.projectedProfit >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        ₹ {costResults.projections.projectedProfit.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Projected ROI:</span>
                      <strong className="text-emerald-400">
                        {costResults.projections.roiPercent}%
                      </strong>
                    </div>
                  </div>

                  {/* Break-Even Yield Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                    <strong className="block text-amber-300 font-semibold uppercase tracking-wider text-[10px]">
                      Break-Even Yield Threshold:
                    </strong>
                    <p className="text-sm font-bold text-white">
                      {costResults.projections.breakEvenYieldPerAcre} {costResults.yieldUnit}/acre
                    </p>
                    <p className="text-[11px] text-gray-300">
                      You need at least {costResults.projections.breakEvenYieldPerAcre} {costResults.yieldUnit}s per acre
                      to cover all input costs. Your expected yield is {costResults.projections.expectedYieldTotal / costResults.acres} {costResults.yieldUnit}s (Safety margin: +{costResults.projections.safetyMarginQuintals} {costResults.yieldUnit}s).
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 italic pt-2">
                  Market Price Basis: ₹{costResults.marketPricePerUnit}/{costResults.yieldUnit}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AGRONOMIC SOWING CALENDAR                                         */}
      {/* ========================================================================= */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarDays size={20} className="text-emerald-400" />
                Agricultural Cropping Calendar Guide
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Seasonal sowing windows, duration, and water requirements across major agricultural seasons.
              </p>
            </div>
            <button
              onClick={fetchCalendar}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
              title="Refresh"
            >
              <RefreshCw size={14} className={calendarLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {calendarLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-44 bg-white/5 rounded-2xl border border-white/10" />
              <div className="h-44 bg-white/5 rounded-2xl border border-white/10" />
            </div>
          ) : !calendarData ? null : (
            <div className="space-y-8">
              {calendarData.seasons.map((season) => (
                <div
                  key={season.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        {season.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">{season.description}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 font-medium">
                      {season.months}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                    {season.crops.map((c) => (
                      <div
                        key={c.cropName}
                        className="p-3.5 rounded-xl bg-slate-800/60 border border-white/5 space-y-2 text-xs"
                      >
                        <div className="flex justify-between items-start">
                          <strong className="text-white font-medium text-sm">{c.cropName}</strong>
                          <span className="text-[10px] text-gray-400 font-medium">{c.durationDays}d</span>
                        </div>

                        <div className="space-y-1 text-gray-300 text-[11px]">
                          <p>
                            Sowing: <strong className="text-emerald-400">{c.sowingWindow}</strong>
                          </p>
                          <p>
                            Harvest: <span className="text-gray-400">{c.harvestWindow}</span>
                          </p>
                          <p>
                            Avg Yield: <span className="text-gray-400">{c.avgYield}</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 capitalize">Water: {c.waterRequirement}</span>
                          <span className="text-emerald-400 font-semibold">
                            ₹{c.avgProfitPerAcre.toLocaleString("en-IN")}/ac
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
