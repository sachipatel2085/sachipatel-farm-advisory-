import React, { useEffect, useState } from "react";
import communityService from "../services/communityService";
import PostCard from "../components/community/PostCard";
import CreatePostModal, { CATEGORIES } from "../components/community/CreatePostModal";
import Breadcrumb from "../components/Breadcrumb";
import {
  Users,
  MessageSquare,
  Search,
  Plus,
  RefreshCw,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Tag,
  ShieldCheck,
} from "lucide-react";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ cropTags: [], categoryCounts: {} });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCropTag, setSelectedCropTag] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "solved" | "unanswered" | "popular"
  const [sortOption, setSortOption] = useState("latest");

  const loadPosts = async () => {
    setLoading(true);
    try {
      const [postsRes, metaRes] = await Promise.all([
        communityService.getPosts({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          cropTag: selectedCropTag !== "all" ? selectedCropTag : undefined,
          q: searchQuery.trim() || undefined,
          filter: activeFilter !== "all" ? activeFilter : undefined,
          sort: activeFilter === "popular" ? "popular" : sortOption,
        }),
        communityService.getMeta(),
      ]);

      setPosts(postsRes?.posts || []);
      setMeta(metaRes || { cropTags: [], categoryCounts: {} });
    } catch (err) {
      console.error("Failed to load community:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedCategory, selectedCropTag, activeFilter, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPosts();
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await communityService.toggleLikePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, hasLiked: res.hasLiked, likeCount: res.likeCount }
            : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName="Farmer Community" />

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Users size={22} />
            </div>
            Farmer Community & Agricultural Q&A
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Exchange field insights, seek expert pest diagnosis, and discuss Mandi market conditions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadPosts}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
            title="Refresh discussions"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-600/20"
          >
            <Plus size={16} /> Ask Question
          </button>
        </div>
      </div>

      {/* Community Banner with Verified Agronomists */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white">
              Verified Agronomist & Peer Network
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Agricultural scientists and fellow farmers are active. Look for the{" "}
              <span className="text-emerald-300 font-medium">Verified Agronomist</span> badge on solutions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            Active Topics: <strong className="text-white">{posts.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search discussions, symptoms, chemical remedies, Mandis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-20 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  loadPosts();
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
            >
              Search
            </button>
          </form>

          {/* Crop Tag Selector */}
          <div className="flex items-center gap-2 text-xs self-start md:self-auto">
            <Tag size={14} className="text-gray-400" />
            <select
              value={selectedCropTag}
              onChange={(e) => setSelectedCropTag(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-2 text-gray-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Crops</option>
              {meta.cropTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Tabs & Category Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-gray-400 hover:text-white"
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setActiveFilter("solved")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                activeFilter === "solved"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              <CheckCircle2 size={13} /> Solved
            </button>
            <button
              onClick={() => setActiveFilter("unanswered")}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
                activeFilter === "unanswered"
                  ? "bg-amber-500 text-black font-semibold"
                  : "bg-slate-800 text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              <HelpCircle size={13} /> Needs Answer
            </button>
            <button
              onClick={() => setActiveFilter("popular")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeFilter === "popular"
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-slate-800 text-gray-400 hover:text-white"
              }`}
            >
              Most Popular
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500 ml-auto"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discussions Feed */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
          <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <MessageSquare size={44} className="mx-auto text-gray-500" />
          <p className="text-white font-medium text-base">No discussions match your filter</p>
          <p className="text-gray-400 text-xs">
            Be the first to ask a question or start a discussion on this topic!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition shadow-lg shadow-emerald-600/20"
          >
            <Plus size={14} /> Ask Question
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onLike={handleLikePost} />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadPosts}
      />
    </div>
  );
}
