import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProduct = async (data) => {
  return axiosInstance.post("/api/v1/product", data);
};

export const getTopRatedProduct = async () => {
  return axiosInstance.get("/api/v1/review/product/top-rated");
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

export const getRelatedProduct = async (data) => {
  return axiosInstance.post("/api/v1/product/category/related", data);
};

export const AddtoCart = async (data) => {
  return axiosInstance.post("/api/v1/cart/create", data);
};

export const getUserCart = async (data) => {
  return axiosInstance.get(`/api/v1/cart/${data}`);
};

export const UpdateUserCart = async (data) => {
  console.log(data);
  return axiosInstance.put("/api/v1/cart/update", data);
};

export const SendQuestions = async (data) => {
  console.log(data);
  return axiosInstance.post("/api/v1/contact", data);
};

export const getUserAddress = async (id) => {
  return axiosInstance.get(`/api/v1/address/${id}`);
};

export const addUserAddress = async (data) => {
  return axiosInstance.post("/api/v1/address/create", data);
};

export const UpdateUserAddress = async (data) => {
  return axiosInstance.put("/api/v1/address/update", data);
};
