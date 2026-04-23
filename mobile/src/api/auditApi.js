import api from "./axios";

export const getAuditLogsRequest = async ({
  fecha_desde = "",
  fecha_hasta = "",
  usuario_id = "",
  accion = "",
  page = 1,
  page_size = 10,
} = {}) => {
  const params = { page, page_size };

  if (fecha_desde) params.fecha_desde = fecha_desde;
  if (fecha_hasta) params.fecha_hasta = fecha_hasta;
  if (usuario_id) params.usuario_id = usuario_id;
  if (accion) params.accion = accion;

  const response = await api.get("/audit-logs", { params });
  return response.data;
};

export const getStockAlertsRequest = async (query = "") => {
  const response = await api.get("/alerts-stock", {
    params: query ? { query } : {},
  });
  return response.data;
};