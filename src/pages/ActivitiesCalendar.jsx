import React, { useEffect, useState } from "react";
import cropActivityService from "../services/cropActivityService";
import api from "../api/axios";
import ActivityItem from "../components/activity/ActivityItem";
import ActivityCalendarView from "../components/activity/ActivityCalendarView";
import AddActivityModal from "../components/activity/AddActivityModal";
import Breadcrumb from "../components/Breadcrumb";
import {
  Calendar as CalendarIcon,
  ListTodo,
  Plus,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Leaf,
  Bug,
  Droplets,
  Sprout,
} from "lucide-react";

export default function ActivitiesCalendar() {
  const [activities, setActivities] = useState([]);
  const [crops, setCrops] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pendingCount: 0,
    completedCount: 0,
    overdueCount: 0,
    todayCount: 0,
    typeCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "list"
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState("");

  // Filters
  const [selectedCropId, setSelectedCropId] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [actRes, cropsRes] = await Promise.all([
        cropActivityService.getAllActivities({
          cropId: selectedCropId !== "all" ? selectedCropId : undefined,
          activityType: selectedType !== "all" ? selectedType : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          timeframe: selectedTimeframe !== "all" ? selectedTimeframe : undefined,
        }),
        api.get("/crops"),
      ]);

      setActivities(actRes?.activities || []);
      setStats(
        actRes?.stats || {
          total: 0,
          pendingCount: 0,
          completedCount: 0,
          overdueCount: 0,
          todayCount: 0,
          typeCounts: {},
        }
      );

      const cropList = Array.isArray(cropsRes.data)
        ? cropsRes.data
        : cropsRes.data?.crops || [];
      setCrops(cropList);
    } catch (err) {
      console.error("Failed to load activities/calendar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [selectedCropId, selectedType, selectedStatus, selectedTimeframe]);

  const handleToggle = async (id) => {
    try {
      await cropActivityService.toggleStatus(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to toggle:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await cropActivityService.deleteActivity(id);
      await loadAll();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleOpenAddForDate = (dateStr) => {
    setSelectedDateForAdd(dateStr);
    setShowAddModal(true);
  };

  // Group activities for list view: Overdue, Today, Upcoming, Completed
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const overdueList = activities.filter(
    (a) => a.status !== "completed" && new Date(a.dueDate) < startOfToday
  );
  const todayList = activities.filter(
    (a) =>
      a.status !== "completed" &&
      new Date(a.dueDate) >= startOfToday &&
      new Date(a.dueDate) <= endOfToday
  );
  const upcomingList = activities.filter(
    (a) => a.status !== "completed" && new Date(a.dueDate) > endOfToday
  );
  const completedList = activities.filter((a) => a.status === "completed");

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName="Tasks & Calendar" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CalendarIcon size={22} />
            </div>
            Crop Activities & Task Calendar
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage fertilizer schedules, spray reminders, and pending field duties across your farm.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-800 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "calendar"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CalendarIcon size={14} /> Calendar
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ListTodo size={14} /> Agenda
            </button>
          </div>

          <button
            onClick={loadAll}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => {
              setSelectedDateForAdd("");
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-600/20"
          >
            <Plus size={16} /> Schedule Task
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Total Tasks</span>
            <CalendarIcon size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-[11px] text-gray-500 mt-1">Farm activities</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span>Due Today</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{stats.todayCount}</p>
          <p className="text-[11px] text-amber-400/70 mt-1">Scheduled for today</p>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-300 text-xs mb-1">
            <span>Overdue</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">{stats.overdueCount}</p>
          <p className="text-[11px] text-rose-400/70 mt-1">Immediate action needed</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span>Completed</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.completedCount}</p>
          <p className="text-[11px] text-emerald-400/70 mt-1">Finished field jobs</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe buttons */}
          <button
            onClick={() => setSelectedTimeframe("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedTimeframe === "all"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-gray-400 hover:text-white"
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => setSelectedTimeframe("today")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedTimeframe === "today"
                ? "bg-amber-500 text-black font-semibold"
                : "bg-slate-800 text-amber-400 hover:text-white"
            }`}
          >
            Due Today ({stats.todayCount})
          </button>
          <button
            onClick={() => setSelectedTimeframe("upcoming")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedTimeframe === "upcoming"
                ? "bg-teal-500 text-white font-semibold"
                : "bg-slate-800 text-teal-400 hover:text-white"
            }`}
          >
            Upcoming (7 Days)
          </button>
          {stats.overdueCount > 0 && (
            <button
              onClick={() => setSelectedTimeframe("overdue")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedTimeframe === "overdue"
                  ? "bg-rose-500 text-white font-semibold"
                  : "bg-slate-800 text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              Overdue ({stats.overdueCount})
            </button>
          )}

          {/* Activity Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500 ml-auto capitalize"
          >
            <option value="all">All Activity Types</option>
            <option value="fertilizer">Fertilizer / Nutrition</option>
            <option value="spray">Spray / Pesticide</option>
            <option value="irrigation">Irrigation / Watering</option>
            <option value="weeding">Weeding</option>
            <option value="harvest">Harvest</option>
            <option value="scouting">Scouting</option>
          </select>

          {/* Crop Selector */}
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Crops ({crops.length})</option>
            {crops.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cropName} {c.farmName ? `(${c.farmName})` : ""}
              </option>
            ))}
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>
      </div>

      {/* Main View: Calendar or Agenda */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-64 bg-white/5 rounded-2xl border border-white/10" />
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
        </div>
      ) : viewMode === "calendar" ? (
        <ActivityCalendarView
          activities={activities}
          onOpenAddModal={handleOpenAddForDate}
          onToggleActivity={handleToggle}
        />
      ) : (
        /* Agenda / List View */
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <CalendarIcon size={44} className="mx-auto text-gray-500" />
              <p className="text-white font-medium text-base">No tasks match your filters</p>
              <p className="text-gray-400 text-xs">
                Adjust your filter selections or schedule a new task.
              </p>
              <button
                onClick={() => {
                  setSelectedCropId("all");
                  setSelectedType("all");
                  setSelectedStatus("all");
                  setSelectedTimeframe("all");
                }}
                className="mt-2 text-xs text-emerald-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              {/* Overdue Section */}
              {overdueList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-rose-400 text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Overdue Tasks ({overdueList.length})
                  </h3>
                  <div className="space-y-2">
                    {overdueList.map((act) => (
                      <ActivityItem
                        key={act._id}
                        activity={act}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Today Section */}
              {todayList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-amber-400 text-sm flex items-center gap-2">
                    <Clock size={16} />
                    Today's Schedule ({todayList.length})
                  </h3>
                  <div className="space-y-2">
                    {todayList.map((act) => (
                      <ActivityItem
                        key={act._id}
                        activity={act}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Section */}
              {upcomingList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <CalendarIcon size={16} className="text-emerald-400" />
                    Upcoming Activities ({upcomingList.length})
                  </h3>
                  <div className="space-y-2">
                    {upcomingList.map((act) => (
                      <ActivityItem
                        key={act._id}
                        activity={act}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Section */}
              {completedList.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-semibold text-gray-400 text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Completed Activities ({completedList.length})
                  </h3>
                  <div className="space-y-2">
                    {completedList.map((act) => (
                      <ActivityItem
                        key={act._id}
                        activity={act}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      <AddActivityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadAll}
        defaultDate={selectedDateForAdd}
      />
    </div>
  );
}
