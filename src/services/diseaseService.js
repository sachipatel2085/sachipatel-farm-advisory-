import api from "../api/axios";

export const diseaseService = {
  // Get all diseases with filtering & pagination
  getAllDiseases: async (params = {}) => {
    const res = await api.get("/diseases", { params });
    return res.data;
  },

  // Get specific disease advisory by key or ID
  getDisease: async (idOrKey) => {
    const res = await api.get(`/diseases/${idOrKey}`);
    return res.data;
  },

  // Admin / Moderator: Create disease advisory
  createDisease: async (data) => {
    const res = await api.post("/diseases", data);
    return res.data;
  },

  // Admin / Moderator: Update disease advisory
  updateDisease: async (id, data) => {
    const res = await api.put(`/diseases/${id}`, data);
    return res.data;
  },

  // Admin / Moderator: Delete disease advisory
  deleteDisease: async (id) => {
    const res = await api.delete(`/diseases/${id}`);
    return res.data;
  },
};

export default diseaseService;
