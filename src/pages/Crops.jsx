import React from "react";
import CropList from "../components/CropList";
import Breadcrumb from "../components/Breadcrumb";

const Crops = () => {
  return (
    <div className="crop-main">
      <Breadcrumb />
      <CropList />
    </div>
  );
};

export default Crops;
