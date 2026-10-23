import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import FarmList from "../components/FarmList";
import { Wheat, Plus } from "lucide-react";

const FarmPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6 text-slate-200 w-full min-w-0">
      <Breadcrumb />

      {/* HEADER */}
      <div className="flex justify-between items-center mt-2 mb-4 sm:mb-6 flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold">
            <Wheat size={22} className="text-emerald-400 shrink-0" /> Farm Management
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage all your farms and acreage efficiently
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <FarmList />
    </div>
  );
};

export default FarmPage;
