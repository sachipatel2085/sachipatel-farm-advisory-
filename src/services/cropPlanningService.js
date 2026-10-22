import api from "../api/axios";

export const cropPlanningService = {
  /**
   * Pre-sowing scientific crop decision recommendation
   */
  async getPreSowingRecommendations(params = {}) {
    const response = await api.post("/planning/pre-sowing", params);
    return response.data;
  },

  /**
   * Crop rotation planner
   */
  async getCropRotationPlan(params = {}) {
    const response = await api.post("/planning/rotation", params);
    return response.data;
  },

  /**
   * Input cost calculator and break-even analysis
   */
  async estimateInputCosts(params = {}) {
    const response = await api.post("/planning/cost-estimator", params);
    return response.data;
  },

  /**
   * Seasonal agronomic calendar & sowing windows
   */
  async getAgronomicCalendar() {
    const response = await api.get("/planning/calendar");
    return response.data;
  },
};

export default cropPlanningService;
