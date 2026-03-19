import api from "./axios";

export const getCategoriesRequest = async () => {
  const response = await api.get("/categories");
  return response.data;
};