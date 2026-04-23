import api, { publicApi } from "./axios";

export const loginRequest = async (payload) => {
  const response = await publicApi.post("/auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getMeRequest = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};