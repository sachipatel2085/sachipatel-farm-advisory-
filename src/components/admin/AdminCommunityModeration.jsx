import React, { useState, useEffect } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";

export default function AdminCommunityModeration({ onPostDeleted }) {
  const navigate = useNavigate();
  const [moderationPosts, setModerationPosts] = useState([]);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [moderationFilter, setModerationFilter] = useState("all");

  const fetchModerationPosts = async () => {
    setModerationLoading(true);
    try {
      const data = await adminService.getCommunityPosts({
        filter: moderationFilter,
      });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.posts)
        ? data.posts
        : [];
      setModerationPosts(list);
    } catch (err) {
      console.error("Fetch moderation error:", err);
      setModerationPosts([]);
    } finally {
      setModerationLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationPosts();
  }, [moderationFilter]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this community post and its comments permanently?")) return;
    try {
      await adminService.deleteCommunityPost(postId);
      fetchModerationPosts();
      if (onPostDeleted) onPostDeleted();
    } catch (err) {
      alert("Post deletion failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER & FILTERS */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-400" />
            Community Inquiries Moderation
          </h3>
          <p className="text-xs text-gray-400">
            Review discussions, eliminate spam, and ensure expert accuracy across forums.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setModerationFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              moderationFilter === "all"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setModerationFilter("unanswered")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              moderationFilter === "unanswered"
                ? "bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Needs Answer
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-3">
        {moderationLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ))
        ) : !Array.isArray(moderationPosts) || moderationPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
            No discussions pending moderation.
          </div>
        ) : (
          moderationPosts.map((post) => (
            <div
              key={post._id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-emerald-500/40 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {post.category || "General"}
                    </span>
                    {post.isSolved && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                        ✓ Solved
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      by {post.author?.name || "Farmer"} ({post.author?.role || "farmer"})
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm sm:text-base text-white hover:text-emerald-300 transition">
                    {post.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/community/${post.slug || post._id}`)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition"
                  >
                    Open Post →
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                    title="Delete Question"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
