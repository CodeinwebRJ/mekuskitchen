import { useEffect, useState } from "react";
import style from "../../styles/Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import Sidebar from "./Sidebar";
import { setCategory } from "../../../Store/Slice/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa6";
import { logout } from "../../../Store/Slice/UserSlice";
import {
  setCartCount,
  setWishlistCount,
} from "../../../Store/Slice/CountSlice";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { cartCount, wishlistCount } = useSelector((state) => state.count);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
  };

  const handleLogout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      dispatch(logout());
      localStorage.removeItem("api_token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const data = [
    {
      name: "Food",
      value: "food",
    },
    {
      name: "Grocery",
      value: "grocery",
    },
  ];

  const handleLinkActive = (link) => {
    return link === window.location.pathname ? style.linkActive : style.link;
  };

  useEffect(() => {
    if (isAuthenticated) {
      try {
        // Retrieve and parse wishlist from localStorage
        const wishlist = localStorage.getItem("wishlist");
        const parsedWishlist = wishlist ? JSON.parse(wishlist) : [];
        dispatch(setWishlist(parsedWishlist));
        dispatch(setWishlistCount(parsedWishlist.length));

        // Retrieve and parse cart from localStorage
        const cartData = localStorage.getItem("cart");
        const parsedCart = cartData ? JSON.parse(cartData) : [];
        dispatch(setCart(parsedCart));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        dispatch(setWishlist([]));
        dispatch(setWishlistCount(0));
        dispatch(setCart([]));
      }
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    const productItemsCount =
      cart?.items?.length > 0
        ? cart.items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
        : 0;
    dispatch(setCartCount(productItemsCount));
  }, [cart, dispatch]);

  return (
    <header className={style.header}>
      <Link to="/" className={style.logo}>
        <img src="/logo.png" alt="logo" className={style.logoImage} />
      </Link>

      <nav className={style.navLinks}>
        <Link to="/" className={`${style.link} ${handleLinkActive("/")}`}>
          HOME
        </Link>

        <div className={style.ourMenuDropdown}>
          <span className={style.ourMenuDropdownLink}>OUR MENU</span>
          <div className={style.ourMenuDropdownMenu}>
            {data?.map((item, index) => (
              <Link
                key={index}
                to={`/product-category/${item.value}`}
                className={style.ourMenuDropdownItem}
                onClick={() => handleCategoryClick(item.value)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/daily-tiffin"
          className={`${style.link} ${handleLinkActive("/daily-tiffin")}`}
        >
          DAILY TIFFIN
        </Link>
        <Link
          to="/about-us"
          className={`${style.link} ${handleLinkActive("/about-us")}`}
        >
          ABOUT US
        </Link>
        <Link
          to="/contact-us"
          className={`${style.link} ${handleLinkActive("/contact-us")}`}
        >
          CONTACT US
        </Link>
      </nav>

      <div className={style.headerIcons}>
        <IoSearch className={style.icon} />

        <div className={style.userDropdown}>
          <LuUserRound className={style.userDropdownIcon} />
          <div className={style.userDropdownMenu}>
            <Link to="/my-account" className={style.userDropdownItem}>
              Dashboard
            </Link>
            <Link to="/my-account/orders" className={style.userDropdownItem}>
              Orders
            </Link>
            <Link to="/my-account/downloads" className={style.userDropdownItem}>
              Downloads
            </Link>
            <Link to="/my-account/addresses" className={style.userDropdownItem}>
              Address
            </Link>
            <Link
              to="/my-account/account-details"
              className={style.userDropdownItem}
            >
              Account Details
            </Link>
            <span onClick={handleLogout} className={style.userDropdownItem}>
              {isAuthenticated ? "Logout" : "Login"}
            </span>
          </div>
        </div>

        <Link to="/wishlist" className={style.wishlist}>
          <FaRegHeart className={style.icon} />
          <span className={style.wishlistCount}>{wishlistCount ?? 0}</span>
        </Link>

        <div className={style.cart} onClick={() => setIsSidebarOpen(true)}>
          <PiShoppingCartSimpleBold className={style.icon} />
          <span className={style.cartCount}>{cartCount ?? 0}</span>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Header;
