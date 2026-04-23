import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { breadcrumbMap } from "../utils/breadcrumbMap";

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
    <div className="flex flex-wrap items-center text-sm text-gray-400 mb-4">
      {/* HOME */}
      <Link to="/" className="hover:text-white transition">
        Home
      </Link>

      {parts.map((p, i) => {
        path += `/${p}`;
        const label = names[p] || breadcrumbMap[p] || p;
        const isLast = i === parts.length - 1;

        return (
          <span key={i} className="flex items-center">
            <span className="mx-2 text-gray-500">›</span>

            <Link
              to={path}
              className={`transition ${
                isLast ? "text-white font-medium" : "hover:text-white"
              }`}
            >
              {label}
            </Link>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
