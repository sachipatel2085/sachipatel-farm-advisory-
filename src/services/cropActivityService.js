import api from "../api/axios";

export const cropActivityService = {
  /**
   * Fetch all activities with optional filters (status, cropId, activityType, timeframe, dates)
   */
  async getAllActivities(params = {}) {
    const response = await api.get("/activities", { params });
    return response.data;
  },

  /**
   * Fetch activities for a single crop
   */
  async getCropActivities(cropId) {
    const response = await api.get(`/activities/crop/${cropId}`);
    return response.data;
  },

  /**
   * Create a new task / activity
   */
  async createActivity(activityData) {
    const response = await api.post("/activities", activityData);
    return response.data;
  },

  /**
   * Update an existing activity
   */
  async updateActivity(id, activityData) {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  /**
   * One-click toggle completion status
   */
  async toggleStatus(id) {
    const response = await api.patch(`/activities/${id}/toggle`);
    return response.data;
  },

  /**
   * Delete an activity
   */
  async deleteActivity(id) {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },

  /**
   * Auto-generate standard 9-stage care schedule for a crop
   */
  async generateSchedule(cropId) {
    const response = await api.post(`/activities/crop/${cropId}/generate-schedule`);
    return response.data;
  },
};

export default cropActivityService;
