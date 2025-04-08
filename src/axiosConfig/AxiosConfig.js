import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProduct = async (data) => {
  return axiosInstance.post("/api/v1/product/", data);
};
