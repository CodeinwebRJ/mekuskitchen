import React, { useEffect } from "react";
import "./index.css";
import HomePage from "./Routes/Home/HomePage.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import ContactPage from "./Routes/ContactUs/ContactPage";
import ProductPage from "./Routes/ProductPage/ProductPage.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setProducts } from "../Store/Slice/FoodSlice";
import { getProduct } from "./axiosConfig/AxiosConfig";
import CheckOutCart from "./Routes/CheckOut/ChackOutCartPage.jsx";
import AboutPage from "./Routes/AboutUs/AboutPage.jsx";
import FoodPage from "./Routes/OurMenu/FoodPage";
import GroceryPage from "./Routes/OurMenu/GroceryPage";
import DailyTiffinPage from "./Routes/DailyTiffin/DailyTiffinPage.jsx";

const App = () => {
  const { pathname } = useLocation();

  const { page, limit, search, sortBy, category } = useSelector((state) =>
    pathname.startsWith("/product/food/") ||
    pathname === "/product-category/food"
      ? state.food
      : state.grocery
  );

  const dispatch = useDispatch();

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
      console.log(response.data.data);
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
        <Route path="/" element={<HomePage />} />
        <Route path="/product-category/grocery" element={<GroceryPage />} />
        <Route path="/product-category/food" element={<FoodPage />} />
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
