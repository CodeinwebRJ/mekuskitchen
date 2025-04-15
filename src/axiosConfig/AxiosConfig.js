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

export const getTopRatedProduct = async () => {
  return axiosInstance.get("/api/v1/review/top-rated");
};
  
export const addProductReview = async (data) => {
  return axiosInstance.post("/api/v1/review/addreview", data);
};

export const getAllProductReview = async (data) => {
  return axiosInstance.get(`/api/v1/review/${data}`);
};

export const getAllTiffin = async (data) => {
  return axiosInstance.post("/api/v1/tiffin-menu", data);
};