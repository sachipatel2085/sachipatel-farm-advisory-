import api from "../api/axios";

export const advisoryService = {
  /**
   * Fetch personalized advisory recommendations for a specific crop
   */
  async getAdvisoryByCrop(cropId) {
    const response = await api.get(`/advisory/crop/${cropId}`);
    return response.data;
  },

  /**
   * Fetch aggregated advisories and stats across all active crops of current user
   */
  async getAllAdvisories() {
    const response = await api.get("/advisory");
    return response.data;
  },
};

export default advisoryService;
