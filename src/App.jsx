import React, { useEffect } from "react";
import "./index.css";
import HomePage from "./Routes/HomePage";
import { Route, Routes, useLocation } from "react-router-dom";
import FoodPage from "./Routes/FoodPage";
import GroceryPage from "./Routes/GroceryPage";
import AboutPage from "./Routes/AboutPage";
import ContactPage from "./Routes/ContactPage";
import ProductPage from "./Routes/ProductPage";
import TiffinPage from "./Routes/TiffinPage";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setProducts } from "../Store/Slice/FoodSlice";
import { getProduct } from "./axiosConfig/AxiosConfig";

const App = () => {
  const { pathname } = useLocation();

  const { page, limit, search, sortBy, category } = useSelector((state) =>
    pathname === "/product-category/food" ? state.food : state.grocery
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
    if (
      pathname === "/product-category/food" ||
      pathname === "/product-category/grocery"
    ) {
      fetchProducts();
    }
  }, [category]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-category/grocery" element={<GroceryPage />} />
        <Route path="/product-category/food" element={<FoodPage />} />
        <Route path="/daily-tiffin" element={<TiffinPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/product/:category/:id" element={<ProductPage />} />
      </Routes>
    </div>
  );
};

export default App;
