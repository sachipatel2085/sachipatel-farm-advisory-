import React, { useState, useEffect } from "react";
import { Sparkles, Sprout, Plus, X } from "lucide-react";
import adminService from "../../services/adminService";

export default function AdminAdvisoryRules({ onRulesUpdated }) {
  const [advisoryRules, setAdvisoryRules] = useState([]);
  const [advisoryLoading, setAdvisoryLoading] = useState(false);

  // Modal states
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ruleFormData, setRuleFormData] = useState({
    cropName: "",
    minDay: 0,
    maxDay: 30,
    message: "",
    priority: "green",
    soilType: "",
  });

  // Fetch Advisory Rules
  const fetchAdvisoryRules = async () => {
    setAdvisoryLoading(true);
    try {
      const data = await adminService.getAdvisoryRules();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.rules)
        ? data.rules
        : [];
      setAdvisoryRules(list);
    } catch (err) {
      console.error("Fetch advisory rules error:", err);
      setAdvisoryRules([]);
    } finally {
      setAdvisoryLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisoryRules();
  }, []);

  // Save Rule
  const handleSaveRule = async (e) => {
    e.preventDefault();
    try {
      if (editingRule) {
        await adminService.updateAdvisoryRule(editingRule._id, ruleFormData);
      } else {
        await adminService.createAdvisoryRule(ruleFormData);
      }
      setShowRuleModal(false);
      fetchAdvisoryRules();
      if (onRulesUpdated) onRulesUpdated();
    } catch (err) {
      alert("Rule save failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete Rule
  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this advisory rule?")) return;
    try {
      await adminService.deleteAdvisoryRule(ruleId);
      fetchAdvisoryRules();
      if (onRulesUpdated) onRulesUpdated();
    } catch (err) {
      alert("Rule deletion failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER & ACTION */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            Agronomic Care Decision Engine
          </h3>
          <p className="text-xs text-gray-400">
            Configure stage-specific care guidelines, disease prevention scouting & fertilizer schedules.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRule(null);
            setRuleFormData({
              cropName: "",
              minDay: 0,
              maxDay: 30,
              message: "",
              priority: "green",
              soilType: "",
            });
            setShowRuleModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus size={15} /> Add Advisory Rule
        </button>
      </div>

      {/* RULES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {advisoryLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ))
        ) : !Array.isArray(advisoryRules) || advisoryRules.length === 0 ? (
          <div className="col-span-2 p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            No advisory rules found. Click &quot;Add Advisory Rule&quot; to seed the first guideline.
          </div>
        ) : (
          advisoryRules.map((rule) => (
            <div
              key={rule._id}
              className={`p-4 rounded-xl border backdrop-blur-sm space-y-2 transition flex flex-col justify-between ${
                rule.priority === "red"
                  ? "bg-rose-950/20 border-rose-500/30"
                  : rule.priority === "yellow"
                  ? "bg-amber-950/20 border-amber-500/30"
                  : "bg-emerald-950/20 border-emerald-500/30"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sprout size={16} className="text-emerald-400 shrink-0" />
                    <h4 className="font-semibold text-sm text-white capitalize">{rule.cropName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10 text-slate-300">
                      Day {rule.minDay}–{rule.maxDay}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      rule.priority === "red"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        : rule.priority === "yellow"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {rule.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rule.message}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-gray-400">
                <span>Soil: {rule.soilType || "All Soils"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setRuleFormData({
                        cropName: rule.cropName,
                        minDay: rule.minDay,
                        maxDay: rule.maxDay,
                        message: rule.message,
                        priority: rule.priority || "green",
                        soilType: rule.soilType || "",
                      });
                      setShowRuleModal(true);
                    }}
                    className="text-emerald-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule._id)}
                    className="text-rose-400 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT ADVISORY RULE MODAL */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                {editingRule ? "Edit Advisory Rule" : "Add Advisory Rule"}
              </h3>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat, Cotton"
                    value={ruleFormData.cropName}
                    onChange={(e) =>
                      setRuleFormData({ ...ruleFormData, cropName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Priority Alert Tier</label>
                  <select
                    value={ruleFormData.priority}
                    onChange={(e) =>
                      setRuleFormData({ ...ruleFormData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="green">Green (General Care Recommendation)</option>
                    <option value="yellow">Yellow (Critical Timing Warning)</option>
                    <option value="red">Red (Urgent Disease/Pest Alert)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Min Sowing Day</label>
                  <input
                    type="number"
                    min="0"
                    value={ruleFormData.minDay}
                    onChange={(e) =>
                      setRuleFormData({
                        ...ruleFormData,
                        minDay: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Max Sowing Day</label>
                  <input
                    type="number"
                    min="0"
                    value={ruleFormData.maxDay}
                    onChange={(e) =>
                      setRuleFormData({
                        ...ruleFormData,
                        maxDay: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Soil Type Filter (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Black soil, Loam, Alluvial (leave blank for all)"
                  value={ruleFormData.soilType}
                  onChange={(e) =>
                    setRuleFormData({ ...ruleFormData, soilType: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-gray-400 block mb-1">
                  Actionable Advisory Message
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Apply first dose of Urea (25kg/acre). Inspect leaf underside for aphid infestation."
                  value={ruleFormData.message}
                  onChange={(e) =>
                    setRuleFormData({ ...ruleFormData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  {editingRule ? "Update Rule" : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
