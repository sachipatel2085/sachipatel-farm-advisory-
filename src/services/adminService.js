import api from "../api/axios";

export const adminService = {
  // 1. Overview Telemetry & KPIs
  getOverview: async () => {
    const res = await api.get("/admin/overview");
    return res.data;
  },

  // 2. User & Role Management
  getUsers: async (params = {}) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await api.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  },

  claimAdminRole: async (secretKey = "kisan-admin-2026") => {
    const res = await api.post("/admin/claim-admin", { secretKey });
    return res.data;
  },

  // 3. Agronomic Advisory Rules Management
  getAdvisoryRules: async () => {
    const res = await api.get("/admin/advisory-rules");
    return res.data;
  },

  createAdvisoryRule: async (ruleData) => {
    const res = await api.post("/admin/advisory-rules", ruleData);
    return res.data;
  },

  updateAdvisoryRule: async (ruleId, ruleData) => {
    const res = await api.put(`/admin/advisory-rules/${ruleId}`, ruleData);
    return res.data;
  },

  deleteAdvisoryRule: async (ruleId) => {
    const res = await api.delete(`/admin/advisory-rules/${ruleId}`);
    return res.data;
  },

  // 4. General Crop Tasks (Standard Schedules for Specific Crops)
  getGeneralTasks: async (params = {}) => {
    const res = await api.get("/admin/general-tasks", { params });
    return res.data;
  },

  createGeneralTask: async (taskData) => {
    const res = await api.post("/admin/general-tasks", taskData);
    return res.data;
  },

  updateGeneralTask: async (taskId, taskData) => {
    const res = await api.put(`/admin/general-tasks/${taskId}`, taskData);
    return res.data;
  },

  deleteGeneralTask: async (taskId) => {
    const res = await api.delete(`/admin/general-tasks/${taskId}`);
    return res.data;
  },

  // 5. Community Moderation
  getCommunityPosts: async (params = {}) => {
    const res = await api.get("/admin/community", { params });
    return res.data;
  },

  deleteCommunityPost: async (postId) => {
    const res = await api.delete(`/admin/community/${postId}`);
    return res.data;
  },
};

export default adminService;
