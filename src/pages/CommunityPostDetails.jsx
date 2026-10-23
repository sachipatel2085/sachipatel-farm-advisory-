import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import communityService from "../services/communityService";
import CommentItem from "../components/community/CommentItem";
import { getCategoryBadge } from "../components/community/PostCard";
import Breadcrumb from "../components/Breadcrumb";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Send,
  AlertCircle,
  Tag,
  Clock,
  Pin,
  Trash2,
} from "lucide-react";

export default function CommunityPostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

  // Read current user ID from local storage or JWT if stored
  const currentToken = localStorage.getItem("token");

  // Prevent duplicate view increments on React StrictMode mount
  const hasCountedViewRef = useRef(false);

  useEffect(() => {
    hasCountedViewRef.current = false;
  }, [id]);

  const loadPostDetails = async (countView = false) => {
    setLoading(true);
    setError("");
    try {
      const data = await communityService.getPostById(id, { skipView: !countView });
      setPost(data.post);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Load post error:", err);
      setError(
        err.response?.data?.message || "Failed to load discussion thread."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const shouldCount = !hasCountedViewRef.current;
      hasCountedViewRef.current = true;
      loadPostDetails(shouldCount);
    }
  }, [id]);

  const handleLikePost = async () => {
    setLikingPost(true);
    try {
      const res = await communityService.toggleLikePost(id);
      setPost((prev) =>
        prev ? { ...prev, hasLiked: res.hasLiked, likeCount: res.likeCount } : null
      );
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikingPost(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await communityService.addComment(id, {
        content: commentText.trim(),
      });
      setComments((prev) => [...prev, res.comment]);
      setCommentText("");
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null
      );
    } catch (err) {
      console.error("Add comment error:", err);
      alert(err.response?.data?.message || "Failed to post answer.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const res = await communityService.toggleLikeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, hasLiked: res.hasLiked, likeCount: res.likeCount }
            : c
        )
      );
    } catch (err) {
      console.error("Like comment error:", err);
    }
  };

  const handleAcceptSolution = async (commentId) => {
    try {
      await communityService.markAcceptedSolution(id, commentId);
      await loadPostDetails(false);
    } catch (err) {
      console.error("Accept solution error:", err);
      alert(err.response?.data?.message || "Failed to mark solution.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse max-w-4xl mx-auto w-full min-w-0">
        <div className="h-6 w-32 bg-white/10 rounded" />
        <div className="h-44 bg-white/5 rounded-2xl border border-white/10" />
        <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle size={40} className="mx-auto text-rose-400" />
        <p className="text-white font-medium">{error || "Discussion not found."}</p>
        <button
          onClick={() => navigate("/community")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium"
        >
          Back to Discussions
        </button>
      </div>
    );
  }

  const catConfig = getCategoryBadge(post.category);
  const authorName = post.author?.name || "Farmer";
  const authorRole = post.author?.role || "farmer";

  return (
    <div className="space-y-4 sm:space-y-6 text-slate-200 max-w-4xl mx-auto w-full min-w-0">
      <Breadcrumb currentName={post.title} />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={14} /> Back to Community
      </button>

      {/* Main Question Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 backdrop-blur-sm">
        {/* Meta Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {post.pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-[10px] uppercase">
                <Pin size={10} /> Pinned Topic
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
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              <CheckCircle2 size={13} /> Solved Discussion
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
          {post.title}
        </h1>

        {/* Content */}
        <div className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line pt-1 border-t border-white/5">
          {post.content}
        </div>

        {/* Author Details & Interaction Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white text-sm font-semibold">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <strong className="text-white font-medium">{authorName}</strong>
                {authorRole === "expert" && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    <ShieldCheck size={11} /> Agronomist
                  </span>
                )}
                {authorRole === "admin" && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Posted {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={handleLikePost}
              disabled={likingPost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                post.hasLiked
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-300 font-medium"
                  : "border-white/10 bg-white/5 text-gray-300 hover:text-rose-400"
              }`}
            >
              <Heart size={14} className={post.hasLiked ? "fill-current" : ""} />
              <span>{post.likeCount || 0} Likes</span>
            </button>

            <span className="flex items-center gap-1 text-gray-400">
              <Eye size={14} /> {post.views || 0} Views
            </span>
          </div>
        </div>
      </div>

      {/* Answer Input Box */}
      <form
        onSubmit={handleAddComment}
        className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
      >
        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
          <MessageSquare size={16} className="text-emerald-400" />
          Share Your Agricultural Advice or Solution
        </h3>

        <textarea
          rows="3"
          placeholder="Suggest remedies, active chemical doses, water management techniques, or share your field experience..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
          required
        />

        <div className="flex justify-between items-center pt-1 text-xs">
          <p className="text-gray-500 italic">
            Be respectful and specific with chemical and dosage recommendations.
          </p>

          <button
            type="submit"
            disabled={submittingComment || !commentText.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            <Send size={13} /> {submittingComment ? "Posting..." : "Post Answer"}
          </button>
        </div>
      </form>

      {/* Answers Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Replies & Solutions</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-normal">
            {comments.length}
          </span>
        </h3>

        {comments.length === 0 ? (
          <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <p className="text-gray-300 font-medium text-sm">No answers posted yet.</p>
            <p className="text-gray-500 text-xs">
              Be the first to provide guidance or recommendations for this farmer!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                isPostAuthor={true} // Allow author to mark solution
                onLike={handleLikeComment}
                onAcceptSolution={handleAcceptSolution}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
