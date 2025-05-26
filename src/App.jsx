import React, { useCallback, useEffect } from "react";
import "./index.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllTiffin,
  getCount,
  getProduct,
  getUserAddress,
  getUserWishlist,
} from "./axiosConfig/AxiosConfig";
import { setLoading, setProducts } from "../Store/Slice/ProductSlice.jsx";
import { setTiffins } from "../Store/Slice/TiffinSlice.jsx";
import {
  setAddresses,
  setDefaultAddress,
} from "../Store/Slice/AddressSlice.jsx";
import { setCartCount, setWishlistCount } from "../Store/Slice/CountSlice.jsx";
import HomePage from "./Routes/Home/HomePage.jsx";
import ContactPage from "./Routes/ContactUs/ContactPage";
import ProductPage from "./Routes/ProductPage/ProductPage.jsx";
import ShoppingCart from "./Routes/CheckOut/ShoppingCart.jsx";
import AboutPage from "./Routes/AboutUs/AboutPage.jsx";
import FoodPage from "./Routes/OurMenu/FoodPage";
import DailyTiffinPage from "./Routes/DailyTiffin/DailyTiffinPage.jsx";
import SignUpPage from "./Routes/SignUp/SignUpPage.jsx";
import LoginPage from "./Routes/Login/LoginPage.jsx";
import TiffinProductPage from "./Routes/TiffinProductPage/ProductPage/TiffinProductPage.jsx";
import Addresses from "./Routes/MyAccount/Addresses/Addresses.jsx";
import Downloads from "./Routes/MyAccount/Downloads/Downloads.jsx";
import Orders from "./Routes/MyAccount/Orders/Orders.jsx";
import AccountDetails from "./Routes/MyAccount/AccountDetails/AccountDetails.jsx";
import Dashboard from "./Routes/MyAccount/Dashboard/Dashboard.jsx";
import AddressForm from "./Routes/MyAccount/Addresses/AddressForm.jsx";
import WishlistPage from "./Routes/Wishlist/WishlistPage.jsx";
import RefundPolicyPage from "./Routes/RefundPolicy/RefundPolicyPage.jsx";
import PrivecyPolicyPage from "./Routes/PrivacyPolicy/PrivecyPolicyPage.jsx";
import CheckoutPage from "./Routes/CheckOut/CheckoutPage.jsx";
import ForgetPassword from "./Routes/ForgetPassword/ForgetPassword.jsx";
import VeryfyOtp from "./Routes/VeryfyOtp/VeryfyOtp.jsx";
import { setWishlist } from "../Store/Slice/UserWishlistSlice.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const {
    page,
    limit,
    search,
    sortBy,
    category,
    subCategory,
    ProductCategory,
  } = useSelector((state) => state.product);

  const Cart = useSelector((state) => state.cart);
  const isLiked = useSelector((state) => state.wishlist?.likedMap);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      dispatch(setLoading(true));
      const data = {
        page,
        limit,
        search,
        sortBy,
        category,
        subCategory,
        ProductCategory,
      };
      const response = await getProduct(data);
      dispatch(setProducts(response.data.data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page, limit, search, sortBy, subCategory, ProductCategory]);

  const fetchTiffin = async () => {
    try {
      const res = await getAllTiffin({ Active: true });
      dispatch(setTiffins(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getUserAddress(user?.userid);
      if (response.status === 200) {
        const data = response?.data?.data || [];
        dispatch(setAddresses(data));
        const activeAddress = data.find((addr) => addr.isActive);
        if (activeAddress) dispatch(setDefaultAddress(activeAddress));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchCount = async () => {
    try {
      const res = await getCount(user?.userid);
      const { CartItemCount, WishListItemCount } = res.data.data;
      dispatch(setCartCount(CartItemCount));
      dispatch(setWishlistCount(WishListItemCount));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWishlist = useCallback(async () => {
    if (!user?.userid) return;
    try {
      const res = await getUserWishlist(user.userid);
      dispatch(setWishlist(res.data.data || []));
    } catch (error) {
      setFetchError("Failed to fetch wishlist.");
      console.error("Error fetching wishlist:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTiffin();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCount();
    }
  }, [isAuthenticated, JSON.stringify(Cart), JSON.stringify(isLiked)]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/product-category/:id" element={<FoodPage />} />
        <Route path="/daily-tiffin" element={<DailyTiffinPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/product/:category/:id" element={<ProductPage />} />
        <Route path="/product/tiffin/:id" element={<TiffinProductPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/forgotpassword" element={<ForgetPassword />} />
        <Route path="/veryfy-email" element={<VeryfyOtp />} />

        {/* Dashboard routes */}
        <Route path="/my-account" element={<Dashboard />} />
        <Route path="/my-account/orders" element={<Orders />} />
        <Route path="/my-account/downloads" element={<Downloads />} />
        <Route path="/my-account/addresses" element={<Addresses />} />
        <Route path="/my-account/add-new-address" element={<AddressForm />} />
        <Route
          path="/my-account/account-details"
          element={<AccountDetails />}
        />

        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivecyPolicyPage />} />
      </Routes>
    </div>
  );
};

export default App;
