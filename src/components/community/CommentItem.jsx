import React, { useState } from "react";
import {
  Heart,
  CheckCircle2,
  ShieldCheck,
  Check,
  User,
  Clock,
} from "lucide-react";

export default function CommentItem({
  comment,
  isPostAuthor,
  onLike,
  onAcceptSolution,
}) {
  const [liking, setLiking] = useState(false);
  const [accepting, setAccepting] = useState(false);

  if (!comment) return null;

  const authorName = comment.author?.name || "Farmer";
  const authorRole = comment.author?.role || "farmer";
  const isExpert = comment.isExpertAnswer || authorRole === "expert";

  const handleLike = async () => {
    if (!onLike) return;
    setLiking(true);
    try {
      await onLike(comment._id);
    } finally {
      setLiking(false);
    }
  };

  const handleAccept = async () => {
    if (!onAcceptSolution) return;
    setAccepting(true);
    try {
      await onAcceptSolution(comment._id);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition space-y-3 ${
        comment.isAcceptedSolution
          ? "border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-950/20"
          : isExpert
          ? "border-teal-500/40 bg-teal-950/15"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      {/* Solution or Expert Header Pill */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {comment.isAcceptedSolution && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold text-xs">
              <CheckCircle2 size={14} /> Accepted Solution
            </span>
          )}

          {isExpert && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold text-xs">
              <ShieldCheck size={14} /> Verified Agronomist Answer
            </span>
          )}
        </div>

        {/* Accept Solution Button (Only for Post Author) */}
        {isPostAuthor && !comment.isAcceptedSolution && (
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-medium transition disabled:opacity-50"
            title="Mark this answer as the correct solution"
          >
            <Check size={13} /> {accepting ? "Marking..." : "Accept as Solution"}
          </button>
        )}
      </div>

      {/* Comment Body */}
      <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
        {comment.content}
      </div>

      {/* Author and Like Footer */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-gray-300 text-xs font-semibold">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-gray-200">{authorName}</span>
            {authorRole === "expert" && (
              <span className="text-[10px] text-emerald-400 font-bold">(Agronomist)</span>
            )}
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
            comment.hasLiked
              ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
              : "border-white/5 bg-white/5 text-gray-400 hover:text-rose-400"
          }`}
        >
          <Heart size={13} className={comment.hasLiked ? "fill-current" : ""} />
          <span>{comment.likeCount || 0}</span>
        </button>
      </div>
    </div>
  );
}
