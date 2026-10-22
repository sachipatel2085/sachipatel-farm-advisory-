import React, { useState } from "react";
import communityService from "../../services/communityService";
import { X, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

export const CATEGORIES = [
  { id: "pest_disease", label: "Pest & Disease Management" },
  { id: "fertilizer_soil", label: "Fertilizer & Soil Health" },
  { id: "irrigation", label: "Water & Irrigation" },
  { id: "market_prices", label: "Mandi Rates & Market Advice" },
  { id: "machinery_tools", label: "Farm Machinery & Implements" },
  { id: "seeds_varieties", label: "Seed Varieties & Sowing" },
  { id: "government_schemes", label: "Subsidies & Schemes" },
  { id: "general", label: "General Farming Discussion" },
];

export default function CreatePostModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "pest_disease",
    cropTag: "Tomato",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please provide a question or discussion title.");
      return;
    }
    if (!formData.content.trim()) {
      setError("Please provide question details or observations.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await communityService.createPost(formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create post error:", err);
      setError(
        err.response?.data?.message || "Failed to publish post. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-400" />
            Ask the Farmer Community
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Question or Discussion Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Yellow leaves on 40-day wheat - Is it yellow rust or nitrogen deficit?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Category & Crop Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Crop Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Wheat, Tomato, Cotton, Rice..."
                value={formData.cropTag}
                onChange={(e) =>
                  setFormData({ ...formData, cropTag: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Detailed Question */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Details & Field Observations *
            </label>
            <textarea
              rows="4"
              placeholder="Describe your crop's current age, soil conditions, visible symptoms, weather, and fertilizers already applied..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              {submitting ? "Publishing..." : "Post Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
