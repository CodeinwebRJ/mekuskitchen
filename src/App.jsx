import React, { useEffect } from "react";
import "./index.css";
import HomePage from "./Routes/Home/HomePage.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import ContactPage from "./Routes/ContactUs/ContactPage";
import ProductPage from "./Routes/ProductPage/ProductPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setProducts } from "../Store/Slice/ProductSlice.jsx";
import { getProduct } from "./axiosConfig/AxiosConfig";
import CheckOutCart from "./Routes/CheckOut/ChackOutCartPage.jsx";
import AboutPage from "./Routes/AboutUs/AboutPage.jsx";
import FoodPage from "./Routes/OurMenu/FoodPage";
import DailyTiffinPage from "./Routes/DailyTiffin/DailyTiffinPage.jsx";
import SignUpPage from "./Routes/SignUp/SignUpPage.jsx";
import LoginPage from "./Routes/Login/LoginPage.jsx";

const App = () => {
  const { pathname } = useLocation();

  const { page, limit, search, sortBy, category } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      dispatch(setLoading(true));
      const data = {
        page,
        limit,
        search,
        sortBy,
        category,
      };
      const response = await getProduct(data);
      dispatch(setProducts(response.data.data));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/product-category/:id" element={<FoodPage />} />
        <Route path="/daily-tiffin" element={<DailyTiffinPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/product/:category/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CheckOutCart />} />
        <Route path="/contactus" element={<ContactPage />} />
      </Routes>
    </div>
  );
};

export default App;
