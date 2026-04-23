import React from "react";
import CropList from "../components/CropList";
import Breadcrumb from "../components/Breadcrumb";
import { Wheat } from "lucide-react";

const Crops = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Breadcrumb />

        {/* HEADER */}
        <div className="mt-4 mb-6">
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
            <Wheat size={22} /> Crop Management
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Track and manage all your crops efficiently
          </p>
        </div>

        {/* CONTENT */}
        <CropList />
      </div>
    </div>
  );
};

export default Crops;
