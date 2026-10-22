import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  AlertTriangle,
  CloudRain,
  Sun,
  Wind,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Layers,
  ThermometerSnowflake,
} from "lucide-react";

export default function WeatherAlertBanner({ alerts = [], location = null }) {
  const { language, t } = useLanguage();
  const [expandedId, setExpandedId] = useState(alerts?.[0]?.id || null);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  if (!alerts || alerts.length === 0) return null;

  const visibleAlerts = alerts.filter((a) => !dismissedIds.has(a.id));
  if (visibleAlerts.length === 0) return null;

  const getAlertIcon = (type) => {
    switch (type) {
      case "frost_risk":
        return <ThermometerSnowflake className="text-cyan-400 shrink-0" size={20} />;
      case "fungal_spread":
        return <ShieldAlert className="text-rose-400 shrink-0" size={20} />;
      case "spray_delay_rain":
        return <CloudRain className="text-amber-400 shrink-0" size={20} />;
      case "heatwave_stress":
        return <Sun className="text-orange-400 shrink-0" size={20} />;
      case "wind_drift":
        return <Wind className="text-teal-400 shrink-0" size={20} />;
      default:
        return <AlertTriangle className="text-yellow-400 shrink-0" size={20} />;
    }
  };

  const getAlertStyling = (severity, type) => {
    if (type === "frost_risk") {
      return {
        card: "bg-cyan-950/40 border-cyan-500/40 text-cyan-200",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        actionBox: "bg-cyan-900/30 border-cyan-500/30 text-cyan-100",
      };
    }
    if (severity === "high") {
      return {
        card: "bg-rose-950/40 border-rose-500/40 text-rose-200",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        actionBox: "bg-rose-900/30 border-rose-500/30 text-rose-100",
      };
    }
    if (severity === "medium") {
      return {
        card: "bg-amber-950/40 border-amber-500/40 text-amber-200",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        actionBox: "bg-amber-900/30 border-amber-500/30 text-amber-100",
      };
    }
    return {
      card: "bg-slate-800/80 border-slate-700 text-slate-200",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      actionBox: "bg-slate-900/50 border-slate-700 text-slate-200",
    };
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-white">
          <Sparkles size={16} className="text-amber-400" />
          {t("weather.smartAlerts", "Weather-Triggered Smart Alerts")}
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {visibleAlerts.length}
          </span>
        </h3>
        {location && (
          <span className="text-xs text-slate-400">
            📍 {location.district || location.village}, {location.state}
          </span>
        )}
      </div>

      <div className="grid gap-3">
        {visibleAlerts.map((alert) => {
          const isExpanded = expandedId === alert.id;
          const styles = getAlertStyling(alert.severity, alert.type);

          const title = alert.title?.[language] || alert.title?.en || "Weather Alert";
          const message = alert.message?.[language] || alert.message?.en || "";
          const action = alert.recommendedAction?.[language] || alert.recommendedAction?.en || "";

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 backdrop-blur-sm ${styles.card}`}
            >
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm sm:text-base text-white">
                        {title}
                      </h4>
                      {alert.metric && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono border ${styles.badge}`}>
                          {alert.metric}
                        </span>
                      )}
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                        {alert.severity === "high"
                          ? t("weather.highSeverity", "Critical")
                          : alert.severity === "medium"
                          ? t("weather.mediumSeverity", "Warning")
                          : t("weather.lowSeverity", "Advisory")}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDismiss(alert.id, e)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
                    title={t("common.close", "Dismiss")}
                  >
                    <X size={15} />
                  </button>
                  <button className="p-1 rounded-lg text-slate-400 hover:text-white transition">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                  {/* Vulnerable Crops */}
                  {alert.vulnerableCrops && alert.vulnerableCrops.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Layers size={13} /> {t("weather.vulnerableCrops", "Crops at Risk")}:
                      </span>
                      {alert.vulnerableCrops.map((cropName, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white font-medium"
                        >
                          {cropName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recommended Agronomic Action */}
                  {action && (
                    <div className={`p-3 rounded-xl border text-xs sm:text-sm space-y-1 ${styles.actionBox}`}>
                      <div className="font-semibold flex items-center gap-1.5 text-white">
                        <span>⚡</span> {t("weather.recommendedAction", "Required Field Action")}:
                      </div>
                      <p className="leading-relaxed opacity-95">{action}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
