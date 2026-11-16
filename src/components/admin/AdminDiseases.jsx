import React, { useState, useEffect } from "react";
import {
  Activity,
  Plus,
  X,
  Edit2,
  Trash2,
  Sprout,
  Search,
  AlertTriangle,
  FlaskConical,
  ShieldCheck,
  Package,
} from "lucide-react";
import diseaseService from "../../services/diseaseService";

export default function AdminDiseases({ onDiseasesUpdated }) {
  const [diseases, setDiseases] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    diseaseKey: "",
    scientificName: "",
    cropsText: "",
    category: "fungal",
    severity: "medium",
    cause: "",
    chemicalTreatment: "",
    organicSolution: "",
    prevention: "",
    stageOfOccurrence: "All Stages",
    isHealthy: false,
  });

  const fetchDiseases = async () => {
    setLoading(true);
    try {
      const data = await diseaseService.getAllDiseases({ limit: 100 });
      setDiseases(data.diseases || []);
      if (data.crops) setCrops(data.crops);
    } catch (err) {
      console.error("Fetch diseases error:", err);
      setDiseases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleOpenAdd = () => {
    setEditingDisease(null);
    setFormData({
      name: "",
      diseaseKey: "",
      scientificName: "",
      cropsText: selectedCrop !== "all" ? selectedCrop : "Tomato, Potato, Chilli",
      category: "fungal",
      severity: "medium",
      cause: "",
      chemicalTreatment: "",
      organicSolution: "",
      prevention: "",
      stageOfOccurrence: "All Stages",
      isHealthy: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDisease(d);
    const cropsStr = Array.isArray(d.crops)
      ? d.crops.join(", ")
      : d.crop || "";

    setFormData({
      name: d.name || "",
      diseaseKey: d.diseaseKey || "",
      scientificName: d.scientificName || "",
      cropsText: cropsStr,
      category: d.category || "fungal",
      severity: d.severity || "medium",
      cause: d.cause || "",
      chemicalTreatment: d.chemicalTreatment || "",
      organicSolution: d.organicSolution || "",
      prevention: d.prevention || "",
      stageOfOccurrence: d.stageOfOccurrence || "All Stages",
      isHealthy: Boolean(d.isHealthy),
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.cause.trim()) {
      alert("Disease Name and Cause are required fields.");
      return;
    }

    const cropList = formData.cropsText
      ? formData.cropsText
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : ["All Crops"];

    const payload = {
      ...formData,
      name: formData.name.trim(),
      crops: cropList,
      crop: cropList[0] || "All Crops",
    };

    try {
      if (editingDisease) {
        await diseaseService.updateDisease(editingDisease._id, payload);
      } else {
        await diseaseService.createDisease(payload);
      }
      setShowModal(false);
      fetchDiseases();
      if (onDiseasesUpdated) onDiseasesUpdated();
    } catch (err) {
      alert("Failed to save disease advisory: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the advisory for "${name}"?`)) return;
    try {
      await diseaseService.deleteDisease(id);
      fetchDiseases();
      if (onDiseasesUpdated) onDiseasesUpdated();
    } catch (err) {
      alert("Failed to delete disease: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredDiseases = diseases.filter((d) => {
    const cropsList = Array.isArray(d.crops) ? d.crops : [d.crop];
    if (
      selectedCrop !== "all" &&
      !cropsList.some((c) => c.toLowerCase() === selectedCrop.toLowerCase())
    ) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (d.name || "").toLowerCase().includes(q);
      const matchCrops = cropsList.some((c) => c.toLowerCase().includes(q));
      const matchSci = (d.scientificName || "").toLowerCase().includes(q);
      const matchCause = (d.cause || "").toLowerCase().includes(q);
      if (!matchName && !matchCrops && !matchSci && !matchCause) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER & ACTION */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Activity size={18} className="text-emerald-400" />
            Universal Plant Disease Knowledge Base
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Advisories are stored by universal disease name (e.g. Powdery Mildew, Early Blight) and linked across multiple crops.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus size={15} /> Add Disease Advisory
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCrop("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              selectedCrop === "all"
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            All Crops ({diseases.length})
          </button>
          {crops.map((c) => {
            const count = diseases.filter((d) => {
              const list = Array.isArray(d.crops) ? d.crops : [d.crop];
              return list.some((item) => item.toLowerCase() === c.toLowerCase());
            }).length;

            return (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 flex items-center gap-1 ${
                  selectedCrop.toLowerCase() === c.toLowerCase()
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Sprout size={13} />
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search diseases, crops, pathogens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* DISEASE LIST */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
        </div>
      ) : filteredDiseases.length === 0 ? (
        <div className="p-10 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <Activity size={36} className="mx-auto text-gray-500" />
          <h4 className="text-white font-medium text-sm">No Disease Advisories Found</h4>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            {selectedCrop === "all"
              ? "No disease advisories matched your search."
              : `No disease advisories configured for ${selectedCrop}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDiseases.map((d) => {
            const affected = Array.isArray(d.crops) ? d.crops : [d.crop];
            return (
              <div
                key={d._id}
                className="p-4 rounded-xl border bg-white/[0.03] border-white/10 hover:border-white/20 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-white/5 text-gray-300 border border-white/10">
                        {d.category}
                      </span>
                      {d.severity && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                            d.severity === "critical"
                              ? "bg-rose-500/20 text-rose-300"
                              : d.severity === "high"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-emerald-500/20 text-emerald-300"
                          }`}
                        >
                          {d.severity}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500 font-mono">
                        key: {d.diseaseKey}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                      {d.name}
                      {d.scientificName && (
                        <span className="text-xs font-normal text-gray-400 italic ml-2">
                          ({d.scientificName})
                        </span>
                      )}
                    </h4>

                    {/* Affected Crops */}
                    {affected.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="text-[11px] text-gray-400">Susceptible Crops:</span>
                        {affected.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      <strong className="text-gray-400 font-medium">Cause:</strong> {d.cause}
                    </p>

                    {d.chemicalTreatment && (
                      <p className="text-xs text-rose-300/90 leading-relaxed line-clamp-1">
                        <strong className="text-rose-400 font-medium">Chemical:</strong> {d.chemicalTreatment}
                      </p>
                    )}

                    {d.organicSolution && (
                      <p className="text-xs text-emerald-300/90 leading-relaxed line-clamp-1">
                        <strong className="text-emerald-400 font-medium">Organic:</strong> {d.organicSolution}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEdit(d)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
                      title="Edit Advisory"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(d._id, d.name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition"
                      title="Delete Advisory"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                {editingDisease ? "Edit Disease Advisory" : "Add Disease Advisory"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Universal Disease Name <span className="text-rose-400">*</span>
                    <span className="text-[11px] text-gray-500 ml-1">(Without crop prefix)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Early Blight, Powdery Mildew, Rust"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Susceptible Crops <span className="text-rose-400">*</span>
                    <span className="text-[11px] text-gray-500 ml-1">(Comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomato, Potato, Chilli, Cucumber, Pea"
                    value={formData.cropsText}
                    onChange={(e) =>
                      setFormData({ ...formData, cropsText: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Scientific / Pathogen Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alternaria solani"
                    value={formData.scientificName}
                    onChange={(e) =>
                      setFormData({ ...formData, scientificName: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fungal">Fungal</option>
                    <option value="bacterial">Bacterial</option>
                    <option value="viral">Viral</option>
                    <option value="pest">Pest / Mites</option>
                    <option value="deficiency">Nutrient Deficiency</option>
                    <option value="healthy">Healthy Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="none">None (Healthy)</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Cause & Environmental Triggers <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Explain pathogen cause, optimal temperature, humidity, spread mechanics..."
                  value={formData.cause}
                  onChange={(e) =>
                    setFormData({ ...formData, cause: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Chemical Treatment (With Dosage per 15L Pump)
                </label>
                <textarea
                  rows="2"
                  placeholder="Specify chemical fungicides/insecticides, exact dosages per 15L spray pump, and intervals..."
                  value={formData.chemicalTreatment}
                  onChange={(e) =>
                    setFormData({ ...formData, chemicalTreatment: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Organic & Biological Solution
                </label>
                <textarea
                  rows="2"
                  placeholder="Bio-fungicides, neem formulations, biological control agents, herbal preparations..."
                  value={formData.organicSolution}
                  onChange={(e) =>
                    setFormData({ ...formData, organicSolution: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  Prevention & Cultural Practices
                </label>
                <textarea
                  rows="2"
                  placeholder="Crop rotation, drip irrigation, certified seed, sanitation, spacing..."
                  value={formData.prevention}
                  onChange={(e) =>
                    setFormData({ ...formData, prevention: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl text-gray-300 bg-white/5 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
                >
                  {editingDisease ? "Update Advisory" : "Save Disease Advisory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
