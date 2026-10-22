import api from "../api/axios";

export const communityService = {
  /**
   * Fetch paginated and filtered community posts
   */
  async getPosts(params = {}) {
    const response = await api.get("/community/posts", { params });
    return response.data;
  },

  /**
   * Fetch a single post with comments
   */
  async getPostById(id, options = {}) {
    const response = await api.get(`/community/posts/${id}`, {
      params: options.skipView ? { skipView: "true" } : {},
    });
    return response.data;
  },

  /**
   * Create a new discussion post
   */
  async createPost(postData) {
    const response = await api.post("/community/posts", postData);
    return response.data;
  },

  /**
   * Toggle like on a post
   */
  async toggleLikePost(id) {
    const response = await api.post(`/community/posts/${id}/like`);
    return response.data;
  },

  /**
   * Add a comment or answer to a post
   */
  async addComment(postId, commentData) {
    const response = await api.post(`/community/posts/${postId}/comments`, commentData);
    return response.data;
  },

  /**
   * Toggle like on a comment
   */
  async toggleLikeComment(commentId) {
    const response = await api.post(`/community/comments/${commentId}/like`);
    return response.data;
  },

  /**
   * Mark a comment as the accepted solution
   */
  async markAcceptedSolution(postId, commentId) {
    const response = await api.patch(`/community/posts/${postId}/solution/${commentId}`);
    return response.data;
  },

  /**
   * Delete a post
   */
  async deletePost(id) {
    const response = await api.delete(`/community/posts/${id}`);
    return response.data;
  },

  /**
   * Fetch available crop tags and category counts
   */
  async getMeta() {
    const response = await api.get("/community/meta");
    return response.data;
  },
};

export default communityService;
