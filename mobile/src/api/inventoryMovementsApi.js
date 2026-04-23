import api from "./axios";

export const registerEntryRequest = async (payload) => {
  const response = await api.post("/movements/entry", payload);
  return response.data;
};

export const registerExitRequest = async (payload) => {
  const response = await api.post("/movements/exit", payload);
  return response.data;
};

export const adjustInventoryRequest = async (payload) => {
  const response = await api.post("/inventory/adjust", payload);
  return response.data;
};