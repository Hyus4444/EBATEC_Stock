import api from "./axios";

export const getAuditLogsRequest = async () => {
  const response = await api.get("/audit-logs");
  return response.data;
};