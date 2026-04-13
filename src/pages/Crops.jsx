import React from "react";
import CropList from "../components/CropList";
import Breadcrumb from "../components/Breadcrumb";
import "../styles/cropsPage.css";
import { Wheat } from "lucide-react";

const Crops = () => {
  return (
    <div className="crop-main dark">
      <div className="crop-container">
        <Breadcrumb />

        {/* HEADER */}
        <div className="crop-header">
          <h1 className="page-title">
            <Wheat size={22} /> Crop Management
          </h1>
          <p>Track and manage all your crops efficiently</p>
        </div>

        {/* CONTENT */}
        <CropList />
      </div>
    </div>
  );
};

export default Crops;
