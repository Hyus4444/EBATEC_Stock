import api from "./axios";

export const getUsersRequest = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUserByIdRequest = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUserRequest = async (payload) => {
  const response = await api.post("/users", payload);
  return response.data;
};

export const updateUserRequest = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const updateUserStatusRequest = async (id, payload) => {
  const response = await api.patch(`/users/${id}/status`, payload);
  return response.data;
};