import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { breadcrumbMap } from "../utils/breadcrumbMap";
import "../styles/breadcrumb.css";

const Breadcrumb = () => {
  const location = useLocation();
  const [names, setNames] = useState({});

  const parts = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const loadNames = async () => {
      const result = {};

      for (let p of parts) {
        if (p.length > 10) {
          try {
            const res = await api.get(`/resolve/${p}`);
            result[p] = res.data.name;
          } catch {
            result[p] = p;
          }
        }
      }
      setNames(result);
    };

    loadNames();
  }, [location.pathname]);

  let path = "";

  return (
    <div className="breadcrumb">
      <Link to="/">Home</Link>

      {parts.map((p, i) => {
        path += `/${p}`;
        const label = names[p] || breadcrumbMap[p] || p;

        return (
          <span key={i}>
            {" › "}
            <Link to={path}>{label}</Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
