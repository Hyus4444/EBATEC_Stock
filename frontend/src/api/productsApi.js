import api from "./axios";

export const getProductsRequest = async ({
  query = "",
  categoria_id = "",
  page = 1,
  page_size = 50,
} = {}) => {
  const params = { page, page_size };

  if (query) params.query = query;
  if (categoria_id) params.categoria_id = categoria_id;

  const response = await api.get("/products", { params });
  return response.data;
};

export const getProductByIdRequest = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductRequest = async (payload) => {
  const response = await api.post("/products", payload);
  return response.data;
};

export const updateProductRequest = async (id, payload) => {
  const response = await api.put(`/products/${id}`, payload);
  return response.data;
};

export const updateProductStatusRequest = async (id, payload) => {
  const response = await api.patch(`/products/${id}/status`, payload);
  return response.data;
};