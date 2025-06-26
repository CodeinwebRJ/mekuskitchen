import { useEffect, useRef, useState } from "react";
import style from "../../styles/Header.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoClose, IoDownloadOutline, IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import {
  PiNotepadLight,
  PiShoppingCartSimpleBold,
  PiUserCircleLight,
} from "react-icons/pi";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa6";
import { logout } from "../../../Store/Slice/UserSlice";
import {
  setCartCount,
  setWishlistCount,
} from "../../../Store/Slice/CountSlice";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { TfiLocationPin } from "react-icons/tfi";
import { FaBars } from "react-icons/fa";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { cartCount, wishlistCount } = useSelector((state) => state.count);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      dispatch(logout());
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLinkActive = (link) => {
    return link === location.pathname ? style.linkActive : style.link;
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const wishlist = localStorage.getItem("wishlist");
        const parsedWishlist = wishlist ? JSON.parse(wishlist) : [];
        dispatch(setWishlist(parsedWishlist));
        dispatch(setWishlistCount(parsedWishlist.length));

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
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      const productItemsCount =
        cart?.items?.items?.length > 0
          ? cart.items.items.reduce(
              (acc, item) => acc + (item?.quantity || 0),
              0
            )
          : 0;
      const tiffinItemsCount =
        cart?.items?.tiffins?.length > 0
          ? cart.items.tiffins.reduce(
              (acc, item) => acc + (item?.quantity || 0),
              0
            )
          : 0;
      const totalCount = productItemsCount + tiffinItemsCount;
      dispatch(setCartCount(totalCount));
    }
  }, [isAuthenticated, cart]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header className={style.header}>
      <Link to="/" className={style.logo}>
        <img src="/logo.png" alt="logo" className={style.logoImage} />
      </Link>

      <nav className={style.navLinks}>
        <Link to="/" className={`${style.link} ${handleLinkActive("/")}`}>
          HOME
        </Link>

        <Link
          to="/product-category"
          className={`${style.link} ${handleLinkActive("/product-category")}`}
        >
          OUR PRODUCT
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className={style.mobileNavMenu} ref={mobileMenuRef}>
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            HOME
          </Link>
          <Link
            to="/product-category"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            OUR PRODUCT
          </Link>
          <Link
            to="/about-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            ABOUT US
          </Link>
          <Link
            to="/contact-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            CONTACT US
          </Link>
          <Link
            to="/my-account"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            DASHBOARD
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            CART
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setIsMobileMenuOpen(false)}
            className={style.mobileLink}
          >
            WISHLIST
          </Link>
        </nav>
      )}

      <div className={style.headerIcons}>
        <IoSearch className={style.icon} />

        <div className={`${style.userDropdown} ${style.hideOnMobile}`}>
          <LuUserRound className={style.userDropdownIcon} />
          <div className={style.userDropdownMenu}>
            <Link to="/my-account" className={style.userDropdownItem}>
              <RxDashboard size={20} /> Dashboard
            </Link>
            <Link to="/my-account/orders" className={style.userDropdownItem}>
              <PiNotepadLight size={20} /> Orders
            </Link>
            <Link to="/my-account/downloads" className={style.userDropdownItem}>
              <IoDownloadOutline size={20} /> Downloads
            </Link>
            <Link to="/my-account/addresses" className={style.userDropdownItem}>
              <TfiLocationPin size={20} /> Address
            </Link>
            <Link
              to="/my-account/account-details"
              className={style.userDropdownItem}
            >
              <PiUserCircleLight size={20} /> Account Details
            </Link>
            <span onClick={handleLogout} className={style.userDropdownItem}>
              {isAuthenticated ? (
                <>
                  <FiLogOut size={20} /> Logout
                </>
              ) : (
                <>
                  <FiLogIn size={20} /> Login
                </>
              )}
            </span>
          </div>
        </div>

        <div
          className={style.mobileMenuIcon}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IoClose size={20} /> : <FaBars size={20} />}
        </div>

        <Link
          to="/wishlist"
          className={`${style.wishlist} ${style.hideOnMobile}`}
        >
          <FaRegHeart className={style.icon} />
          <span className={style.wishlistCount}>{wishlistCount ?? 0}</span>
        </Link>

        <div
          className={`${style.cart} ${style.hideOnMobile}`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <PiShoppingCartSimpleBold className={style.icon} />
          <span className={style.cartCount}>{cartCount ?? 0}</span>
        </div>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Header;
