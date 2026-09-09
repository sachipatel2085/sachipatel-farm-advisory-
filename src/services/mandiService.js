import api from "../api/axios";

export const mandiService = {
  /**
   * Fetch paginated and filtered mandi rates
   */
  async getRates(params = {}) {
    const response = await api.get("/mandi", { params });
    return response.data?.data || { rates: [], pagination: {} };
  },

  /**
   * Fetch distinct states, districts, and commodities
   */
  async getFilters() {
    const response = await api.get("/mandi/filters");
    return response.data?.data || { states: [], commodities: [], districtsByState: {} };
  },

  /**
   * Fetch historical price trend for a crop and optional market
   */
  async getTrends(crop, market = "", days = 14) {
    const response = await api.get("/mandi/trends", {
      params: { crop, market: market || undefined, days },
    });
    return response.data?.data || { trends: [] };
  },

  /**
   * Compare rates across mandis for a given crop
   */
  async getComparison(crop, state = "") {
    const response = await api.get("/mandi/compare", {
      params: { crop, state: state || undefined },
    });
    return response.data?.data || { rankedMarkets: [] };
  },

  /**
   * Fetch market summary metrics & user's crop matches
   */
  async getTodaySummary(userCrops = []) {
    const params = {};
    if (userCrops.length > 0) {
      params.userCrops = userCrops.join(",");
    }
    const response = await api.get("/mandi/today-summary", { params });
    return response.data?.data || {};
  },

  /**
   * Trigger data refresh / seeding
   */
  async syncRates(force = false) {
    const response = await api.post("/mandi/sync", null, {
      params: { force },
    });
    return response.data;
  },
};

export default mandiService;
