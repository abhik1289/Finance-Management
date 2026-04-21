import axiosClient from "./axiosClient";

export async function registerUser(payload) {
  const response = await axiosClient.post("/api/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await axiosClient.post("/api/auth/login", payload);
  return response.data;
}

export async function getProfile() {
  const response = await axiosClient.get("/api/profile");
  return response.data;
}
