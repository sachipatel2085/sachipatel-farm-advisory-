import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  Eye,
  CheckCircle2,
  ShieldCheck,
  User,
  Tag,
  Clock,
  Pin,
} from "lucide-react";

export const getCategoryBadge = (category = "") => {
  switch (category) {
    case "pest_disease":
      return { label: "Pest & Disease", badge: "bg-rose-500/15 text-rose-300 border-rose-500/30" };
    case "fertilizer_soil":
      return { label: "Fertilizer & Soil", badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    case "irrigation":
      return { label: "Irrigation", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    case "market_prices":
      return { label: "Mandi Rates", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
    case "machinery_tools":
      return { label: "Machinery", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30" };
    case "seeds_varieties":
      return { label: "Seeds", badge: "bg-teal-500/15 text-teal-300 border-teal-500/30" };
    case "government_schemes":
      return { label: "Schemes", badge: "bg-purple-500/15 text-purple-300 border-purple-500/30" };
    default:
      return { label: "General", badge: "bg-white/10 text-gray-300 border-white/10" };
  }
};

const getRelativeTime = (dateStr) => {
  if (!dateStr) return "recently";
  const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

export default function PostCard({ post, onLike }) {
  if (!post) return null;

  const [liking, setLiking] = useState(false);
  const catConfig = getCategoryBadge(post.category);

  const authorRole = post.author?.role || "farmer";
  const authorName = post.author?.name || "Farmer";

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onLike) return;
    setLiking(true);
    try {
      await onLike(post._id);
    } finally {
      setLiking(false);
    }
  };

  return (
    <Link
      to={`/community/${post.slug || post._id}`}
      className="block p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.05] transition duration-200 space-y-3.5 backdrop-blur-sm relative group"
    >
      {/* Top Meta: Pinned & Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {post.pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px] uppercase">
              <Pin size={10} /> Pinned
            </span>
          )}

          <span
            className={`inline-block px-2.5 py-0.5 rounded-full font-medium border text-[11px] ${catConfig.badge}`}
          >
            {catConfig.label}
          </span>

          {post.cropTag && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[11px]">
              <Tag size={10} className="text-emerald-400" />
              {post.cropTag}
            </span>
          )}
        </div>

        {post.isSolved && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium">
            <CheckCircle2 size={12} /> Solved
          </span>
        )}
      </div>

      {/* Title & Excerpt */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Author & Interactions Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
        {/* Author details */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-gray-300 text-xs font-semibold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-gray-200">{authorName}</span>

            {/* Role Badge */}
            {authorRole === "expert" ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                <ShieldCheck size={10} /> Agronomist
              </span>
            ) : authorRole === "admin" ? (
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                Moderator
              </span>
            ) : null}

            <span className="text-gray-500">•</span>
            <span className="text-gray-500 flex items-center gap-1">
              <Clock size={11} />
              {getRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Counts & Like */}
        <div className="flex items-center gap-3.5 ml-auto">
          <button
            onClick={handleLikeClick}
            disabled={liking}
            className={`flex items-center gap-1 transition ${
              post.hasLiked ? "text-rose-400 font-medium" : "text-gray-400 hover:text-rose-400"
            }`}
            title="Like this question"
          >
            <Heart size={14} className={post.hasLiked ? "fill-current" : ""} />
            <span>{post.likeCount || 0}</span>
          </button>

          <span className="flex items-center gap-1 text-gray-400" title="Replies">
            <MessageSquare size={14} />
            <span>{post.commentCount || 0}</span>
          </span>

          <span className="flex items-center gap-1 text-gray-500" title="Views">
            <Eye size={14} />
            <span>{post.views || 0}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
