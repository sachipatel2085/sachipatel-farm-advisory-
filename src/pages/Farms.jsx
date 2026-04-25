import React, { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import FarmList from "../components/FarmList";
import { Wheat, Plus } from "lucide-react";

const FarmPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Breadcrumb />

        {/* HEADER */}
        <div className="flex justify-between items-center mt-4 mb-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <Wheat size={22} /> Farm Management
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Manage all your farms efficiently
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <FarmList />
      </div>
    </div>
  );
};

export default FarmPage;
