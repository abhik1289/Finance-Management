import axiosClient from "./axiosClient";

export async function getCategories() {
  const response = await axiosClient.get("/api/categories");
  return response.data;
}

export async function createCategory(payload) {
  const response = await axiosClient.post("/api/categories", payload);
  return response.data;
}

export async function updateCategory(categoryId, payload) {
  const response = await axiosClient.put(
    `/api/categories/${categoryId}`,
    payload,
  );
  return response.data;
}

export async function deleteCategory(categoryId) {
  await axiosClient.delete(`/api/categories/${categoryId}`);
}
