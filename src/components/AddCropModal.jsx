import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Sprout, Leaf, Calendar, Timer, Wheat, Layers } from "lucide-react";

const AddCropModal = ({ isOpen, onClose, onSuccess }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    farmId: "",
    cropName: "",
    variety: "",
    season: "kharif",
    sowingDate: "",
    expectedDurationDays: "",
    expectedYield: "",
  });

  /* ===== LOAD FARMS ===== */
  useEffect(() => {
    if (isOpen) {
      api.get("/farms").then((res) => setFarms(res.data));
    }
  }, [isOpen]);

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  /* ===== HANDLE CHANGE ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== SUBMIT ===== */
  const submitCrop = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/crops", form);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-lg rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sprout size={18} /> Add Crop
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={submitCrop} className="space-y-4">
            {/* FARM SELECT */}
            <div className="relative">
              <Wheat
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <select
                name="farmId"
                value={form.farmId}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Select Farm</option>
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.farmName}
                  </option>
                ))}
              </select>
            </div>

            {/* CROP NAME */}
            <div className="relative">
              <Leaf size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="cropName"
                placeholder="Crop name"
                value={form.cropName}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* VARIETY */}
            <div className="relative">
              <Layers
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                name="variety"
                placeholder="Variety"
                value={form.variety}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* SEASON */}
            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            >
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="summer">Summer</option>
            </select>

            {/* SOWING DATE */}
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="date"
                name="sowingDate"
                value={form.sowingDate}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* DURATION */}
            <div className="relative">
              <Timer
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                name="expectedDurationDays"
                placeholder="Duration (days)"
                value={form.expectedDurationDays}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* YIELD */}
            <div className="relative">
              <Wheat
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                name="expectedYield"
                placeholder="Expected yield (kg)"
                value={form.expectedYield}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submitCrop}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            {loading ? "Saving..." : "Add Crop"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCropModal;
