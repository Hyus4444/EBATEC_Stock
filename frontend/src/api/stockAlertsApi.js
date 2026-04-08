import api from "./axios";

export const getStockAlertsRequest = async (query = "") => {
  const response = await api.get("/alerts-stock", {
    params: query ? { query } : {},
  });
  return response.data;
};