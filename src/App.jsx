import { useCallback, useEffect } from "react";
import "./index.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTiffin,
  getCount,
  getCountryData,
  getHomePageData,
  getProduct,
  getUserAddress,
  getUserCart,
  getUserWishlist,
} from "./axiosConfig/AxiosConfig";
import {
  setCombinations,
  setLoading,
  setProducts,
} from "../Store/Slice/ProductSlice.jsx";
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
import VerifyOtp from "./Routes/VerifyOtp/VerifyOtp.jsx";
import VerifyEmail from "./Routes/VerifyEmail/VerifyEmail.jsx";
import { setWishlist } from "../Store/Slice/UserWishlistSlice.jsx";
import { setCart } from "../Store/Slice/UserCartSlice.jsx";
import { setData } from "../Store/Slice/HomePageSlice.jsx";
import ProtectedRoute from "./Protectedroute/ProtectedRoute.jsx";
import { setCountriesData } from "../Store/Slice/CountrySlice.jsx";
import NotFound from "./Component/MainComponents/NotFound.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const Cart = useSelector((state) => state.cart);
  const isLiked = useSelector((state) => state.wishlist?.likedMap);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const filterData = useSelector((state) => state.filterData);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      dispatch(setLoading(true));
      const data = {
        page: filterData?.page,
        limit: filterData?.limit,
        search: filterData?.search,
        sortBy: filterData?.sortBy,
        category: filterData?.categories,
        subCategory: filterData?.subCategories,
        ProductCategory: filterData?.productCategories,
        brands: filterData?.Brands,
        ratings: filterData?.ratings,
        price: filterData?.price,
        attributes: filterData?.attributes,
        isActive: filterData?.isActive,
      };
      const response = await getProduct(data);
      dispatch(setProducts(response.data.data));
      dispatch(setCombinations(response.data.data.data || []));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 500), [
    filterData,
  ]);

  useEffect(() => {
    if (filterData?.price) {
      debouncedFetchProducts();
    } else {
      fetchProducts();
    }
  }, [filterData]);

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
    if (!isAuthenticated) return;
    try {
      const res = await getUserWishlist(user.userid);
      dispatch(setWishlist(res.data.data || []));
    } catch (error) {
      setFetchError("Failed to fetch wishlist.");
      console.error("Error fetching wishlist:", error);
    }
  }, [isAuthenticated]);

  const fetchHomeData = async () => {
    try {
      const res = await getHomePageData();
      dispatch(setData(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserCart = async () => {
    try {
      const data = {
        id: user.userid,
      };
      const res = await getUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error fetching user cart", error);
    }
  };

  const featchCountryData = async () => {
    try {
      const res = await getCountryData();
      dispatch(setCountriesData(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTiffin();
    fetchHomeData();
    featchCountryData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchWishlist();
      fetchUserCart();
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
        <Route path="/product-category" element={<FoodPage />} />
        <Route path="/daily-tiffin" element={<DailyTiffinPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/product/:category/:id" element={<ProductPage />} />
        <Route path="/product/tiffin/:id" element={<TiffinProductPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account/downloads"
          element={
            <ProtectedRoute>
              <Downloads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account/add-new-address"
          element={
            <ProtectedRoute>
              <AddressForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-account/account-details"
          element={
            <ProtectedRoute>
              <AccountDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/privacy-policy" element={<PrivecyPolicyPage />} />
      </Routes>
    </div>
  );
};

export default App;
