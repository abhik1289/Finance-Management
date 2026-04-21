import axiosClient from "./axiosClient";

export async function getTransactions() {
  const response = await axiosClient.get("/api/transactions");
  return response.data;
}

export async function createTransaction(payload) {
  const response = await axiosClient.post("/api/transactions", payload);
  return response.data;
}

export async function updateTransaction(transactionId, payload) {
  const response = await axiosClient.put(
    `/api/transactions/${transactionId}`,
    payload,
  );
  return response.data;
}

export async function deleteTransaction(transactionId) {
  await axiosClient.delete(`/api/transactions/${transactionId}`);
}
