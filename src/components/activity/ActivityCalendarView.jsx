import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { getActivityTypeConfig } from "./ActivityItem";

export default function ActivityCalendarView({
  activities = [],
  onSelectDate,
  onOpenAddModal,
  onToggleActivity,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState(
    new Date().toISOString().split("T")[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month (0-6)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Total days in previous month
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDayStr(today.toISOString().split("T")[0]);
  };

  // Group activities by date string "YYYY-MM-DD"
  const activitiesByDate = {};
  activities.forEach((act) => {
    if (!act.dueDate) return;
    const dateKey = act.dueDate.split("T")[0];
    if (!activitiesByDate[dateKey]) activitiesByDate[dateKey] = [];
    activitiesByDate[dateKey].push(act);
  });

  const monthName = currentDate.toLocaleString("en-US", { month: "long" });
  const todayStr = new Date().toISOString().split("T")[0];

  // Build grid calendar cells (42 cells: 6 weeks x 7 days)
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const prevDate = new Date(year, month - 1, d);
    const dateStr = prevDate.toISOString().split("T")[0];
    calendarCells.push({
      dayNum: d,
      dateStr,
      isCurrentMonth: false,
      acts: activitiesByDate[dateStr] || [],
    });
  }

  // 2. Current month days
  for (let d = 1; d <= totalDays; d++) {
    const curDate = new Date(year, month, d);
    // Format YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      dayNum: d,
      dateStr,
      isCurrentMonth: true,
      acts: activitiesByDate[dateStr] || [],
    });
  }

  // 3. Next month leading days to complete the 35 or 42 grid
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    const dateStr = nextDate.toISOString().split("T")[0];
    calendarCells.push({
      dayNum: d,
      dateStr,
      isCurrentMonth: false,
      acts: activitiesByDate[dateStr] || [],
    });
  }

  const selectedDayActivities = activitiesByDate[selectedDayStr] || [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon size={20} className="text-emerald-400" />
            {monthName} {year}
          </h2>

          <button
            onClick={goToToday}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white border border-white/10 transition"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white border border-white/10 transition"
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white border border-white/10 transition"
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => onOpenAddModal(selectedDayStr)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-lg shadow-emerald-600/20"
          >
            <Plus size={15} />
            Add Task
          </button>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-3 sm:p-4">
        {/* Day Name Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 pb-2 mb-1 border-b border-white/10">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarCells.map((cell, idx) => {
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDayStr;
            const hasActs = cell.acts.length > 0;
            const pendingCount = cell.acts.filter((a) => a.status !== "completed").length;

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedDayStr(cell.dateStr);
                  if (onSelectDate) onSelectDate(cell.dateStr);
                }}
                className={`min-h-[75px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : isToday
                    ? "border-amber-500/50 bg-amber-500/5"
                    : cell.isCurrentMonth
                    ? "border-white/5 bg-slate-800/40 hover:bg-slate-800 hover:border-white/20"
                    : "border-transparent bg-slate-900/40 text-gray-600"
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday
                        ? "bg-amber-400 text-black font-bold"
                        : isSelected
                        ? "bg-emerald-500 text-white"
                        : cell.isCurrentMonth
                        ? "text-gray-200"
                        : "text-gray-600"
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {pendingCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>

                {/* Task Indicators */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {cell.acts.slice(0, 2).map((act) => {
                    const conf = getActivityTypeConfig(act.activityType);
                    const done = act.status === "completed";

                    return (
                      <div
                        key={act._id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded flex items-center gap-1 font-medium ${
                          done
                            ? "bg-white/5 text-gray-500 line-through"
                            : conf.badge
                        }`}
                        title={`${act.title} (${conf.label})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                        <span className="truncate">{act.title}</span>
                      </div>
                    );
                  })}

                  {cell.acts.length > 2 && (
                    <div className="text-[9px] text-gray-400 pl-1 font-medium">
                      +{cell.acts.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
            <CalendarIcon size={16} className="text-emerald-400" />
            Agenda for{" "}
            {new Date(selectedDayStr + "T00:00:00").toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-normal">
              {selectedDayActivities.length} {selectedDayActivities.length === 1 ? "task" : "tasks"}
            </span>
          </h3>

          <button
            onClick={() => onOpenAddModal(selectedDayStr)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <Plus size={14} /> Add task for this day
          </button>
        </div>

        {selectedDayActivities.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-2">
            No activities scheduled for this date. Click "+ Add Task" to schedule fertilizer, spray, or irrigation.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            {selectedDayActivities.map((act) => {
              const conf = getActivityTypeConfig(act.activityType);
              const done = act.status === "completed";

              return (
                <div
                  key={act._id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    done
                      ? "bg-white/[0.02] border-white/5 opacity-60"
                      : "bg-slate-800/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleActivity(act._id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition ${
                        done
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-gray-500 hover:border-emerald-400"
                      }`}
                    >
                      {done && <CheckCircle2 size={13} />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${conf.badge}`}
                        >
                          {conf.label}
                        </span>
                        <p
                          className={`text-xs font-medium truncate ${
                            done ? "line-through text-gray-400" : "text-white"
                          }`}
                        >
                          {act.title}
                        </p>
                      </div>
                      {act.crop?.cropName && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Crop: {act.crop.cropName}
                        </p>
                      )}
                    </div>
                  </div>

                  {act.cost > 0 && (
                    <span className="text-xs text-emerald-400 font-medium flex-shrink-0">
                      ₹{act.cost}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
