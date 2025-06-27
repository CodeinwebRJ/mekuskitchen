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

export const getProductById = async (id) => {
  return axiosInstance.get(`/api/v1/product/${id}`);
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
  const { id, provinceCode } = data;
  if (!id) {
    throw new Error("User ID is required");
  }
  const url = `/api/v1/cart/${id}?provinceCode=${encodeURIComponent(
    provinceCode
  )}`;
  return axiosInstance.get(url);
};

export const UpdateUserCart = async (data) => {
  return axiosInstance.put("/api/v1/cart/update", data);
};

export const SendQuestions = async (data) => {
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

export const ActiveUserAddress = async (data) => {
  return axiosInstance.post("/api/v1/address/active", data);
};

export const DeleteUserAddress = async (data) => {
  return axiosInstance.put("/api/v1/address/delete", data);
};
export const getUserWishlist = async (id) => {
  return axiosInstance.get(`/api/v1/wishlist/${id}`);
};

export const getCount = async (id) => {
  return axiosInstance.get(`/api/v1/C/${id}`);
};

export const AddtoWishlist = async (data) => {
  return axiosInstance.post("/api/v1/wishlist/create", data);
};

export const RemoveWishlist = async (data) => {
  return axiosInstance.put("/api/v1/wishlist/remove", data);
};

export const getCategory = async () => {
  return axiosInstance.get("/api/v1/categories/get/category");
};

export const sendOrder = async (data) => {
  return axiosInstance.post("/api/v1/order", data);
};

export const getHomePageData = async () => {
  return axiosInstance.get("/api/v1/product/category/home");
};

export const CreatePayment = async (data) => {
  return axiosInstance.post("/api/v1/payment/create", data);
};

export const getUserOrders = async (data) => {
  const { id } = data;
  return axiosInstance.post(`/api/v1/order/user/${id}`, data);
};

export const getOrderById = async (id) => {
  return axiosInstance.post(`/api/v1/order/${id}`);
};

export const getCountryData = async () => {
  return axiosInstance.get("/api/v1/C/get/country");
};

export const CanadaSearch = async (search) => {
  return axiosInstance.get(`/api/v1/address/suggest/canada?search=${search}`);
};

export const ShippingCharges = async (data) => {
  return axiosInstance.post("/api/v1/shipping/create", data);
};

export const googleAddress = async (search) => {
  return axiosInstance.get(
    `/api/v1/address/suggest/googelAddress?search=${search}`
  );
};

export const validateCoupon = async (data) => {
  const {
    userId,
    code,
    orderTotal,
    category,
    date,
    subCategory,
    ProductCategory,
  } = data;

  const params = new URLSearchParams({
    userId,
    code,
    orderTotal,
    category,
    date,
    subCategory,
    ProductCategory,
  });

  return axiosInstance.get(`/api/v1/coupon/validate?${params.toString()}`);
};
