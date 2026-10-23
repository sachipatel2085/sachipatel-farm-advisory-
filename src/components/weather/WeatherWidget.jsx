import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export default function WeatherWidget({ weatherData, loading }) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 animate-pulse space-y-3">
        <div className="h-4 w-32 bg-white/10 rounded" />
        <div className="h-8 w-24 bg-white/10 rounded" />
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2">
          <div className="h-10 bg-white/5 rounded-xl" />
          <div className="h-10 bg-white/5 rounded-xl" />
          <div className="h-10 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const current = weatherData.current || {};
  const location = weatherData.location || {};
  const alertsCount = weatherData.alertsCount || 0;

  const getWeatherIcon = (code) => {
    if (code >= 51 && code <= 67) return <CloudRain size={24} className="text-blue-400 shrink-0" />;
    if (code >= 1 && code <= 3) return <Cloud size={24} className="text-slate-300 shrink-0" />;
    if (code === 0) return <Sun size={24} className="text-amber-400 shrink-0" />;
    return <Sun size={24} className="text-amber-400 shrink-0" />;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 text-white backdrop-blur-md relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {getWeatherIcon(current.weathercode)}
          <div className="min-w-0">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-medium truncate">
              {t("weather.currentCondition", "Live Farm Weather")}
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
              {location.district || location.village || "Agri Station"}
            </p>
          </div>
        </div>

        {alertsCount > 0 ? (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse shrink-0">
            <ShieldAlert size={12} /> {alertsCount} {t("weather.smartAlerts", "Alerts")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
            ✓ Optimal
          </span>
        )}
      </div>

      {/* Main Temperature & Metrics */}
      <div className="flex items-baseline justify-between pt-1 pb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {current.temperature !== undefined ? `${Math.round(current.temperature)}°C` : "--"}
          </span>
          <span className="text-xs text-slate-400 ml-1">
            {current.isDay ? "Daytime" : "Night"}
          </span>
        </div>

        <div className="text-right text-xs text-slate-400">
          <p>Wind: {current.windspeed || "--"} km/h</p>
          <p>Humidity: {current.humidity || "--"}%</p>
        </div>
      </div>

      {/* Quick Indicators Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-white/5 text-xs text-slate-300">
        <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <Droplets size={14} className="mx-auto mb-1 text-cyan-400" />
          <span className="text-[10px] text-slate-400 block">{t("weather.humidity", "Humidity")}</span>
          <span className="font-semibold text-white">{current.humidity || "--"}%</span>
        </div>

        <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <Wind size={14} className="mx-auto mb-1 text-teal-400" />
          <span className="text-[10px] text-slate-400 block">{t("weather.windSpeed", "Wind")}</span>
          <span className="font-semibold text-white">{current.windspeed || "--"} km/h</span>
        </div>

        <div className="p-1.5 sm:p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <CloudRain size={14} className="mx-auto mb-1 text-blue-400" />
          <span className="text-[10px] text-slate-400 block">{t("weather.rainChance", "Rain")}</span>
          <span className="font-semibold text-white">
            {weatherData.forecast?.[0]?.rainProbability !== undefined
              ? `${weatherData.forecast[0].rainProbability}%`
              : "0%"}
          </span>
        </div>
      </div>
    </div>
  );
}
