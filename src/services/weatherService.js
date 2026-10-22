import api from "../api/axios";

export const weatherService = {
  /**
   * Get smart weather alerts and current conditions
   */
  async getWeatherAlerts(params = {}) {
    const response = await api.get("/weather/alerts", { params });
    return response.data;
  },

  /**
   * Get weather forecast for a specific farm
   */
  async getFarmWeather(farmId) {
    const response = await api.get(`/weather/farm/${farmId}`);
    return response.data;
  },
};

export default weatherService;
