import React from "react";
import CropList from "../components/CropList";
import Breadcrumb from "../components/Breadcrumb";
import { Wheat } from "lucide-react";

const Crops = () => {
  return (
    <div className="space-y-4 sm:space-y-6 text-slate-200 w-full min-w-0">
      <Breadcrumb />

      {/* HEADER */}
      <div className="mt-2 mb-4 sm:mb-6">
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold">
          <Wheat size={22} className="text-emerald-400 shrink-0" /> Crop Management
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Track, nurture, and optimize your crops across growing stages
        </p>
      </div>

      {/* CONTENT */}
      <CropList />
    </div>
  );
};

export default Crops;
