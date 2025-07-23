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
import { logout } from "../../../Store/Slice/UserAuthSlice";
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
import { clearUserDetail } from "../../../Store/Slice/UserDetailSlice";
import SearchComponent from "./SearchComponent";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount, wishlistCount } = useSelector((state) => state.count);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cart = useSelector((state) => state.cart);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    try {
      if (isAuthenticated) {
        dispatch(logout());
        dispatch(clearUserDetail());
        localStorage.clear();
        navigate("/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLinkActive = (link) =>
    link === location.pathname ? style.linkActive : style.link;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        dispatch(setWishlist(wishlist));
        dispatch(setWishlistCount(wishlist.length));

        const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
        dispatch(setCart(cartData));
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        dispatch(setWishlist([]));
        dispatch(setWishlistCount(0));
        dispatch(setCart([]));
      }
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      const productItemsCount =
        cart?.items?.items?.reduce(
          (acc, item) => acc + (item?.quantity || 0),
          0
        ) || 0;

      const tiffinItemsCount =
        cart?.items?.tiffins?.reduce(
          (acc, item) => acc + (item?.quantity || 0),
          0
        ) || 0;

      dispatch(setCartCount(productItemsCount + tiffinItemsCount));
    }
  }, [isAuthenticated, cart, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

      {isMobileMenuOpen && (
        <nav className={style.mobileNavMenu} ref={mobileMenuRef}>
          {[
            { to: "/", label: "HOME" },
            { to: "/product-category", label: "OUR PRODUCT" },
            { to: "/about-us", label: "ABOUT US" },
            { to: "/daily-tiffin", label: "DAILY TIFFIN" },
            { to: "/contact-us", label: "CONTACT US" },
            isAuthenticated && { to: "/my-account", label: "DASHBOARD" },
            { to: "/cart", label: "CART" },
            { to: "/wishlist", label: "WISHLIST" },
          ]
            .filter(Boolean)
            .map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={style.mobileLink}
              >
                {label}
              </Link>
            ))}

          <Link className={style.mobileLink}>
            {isAuthenticated ? (
              <span
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className={style.mobileLink}
              >
                <FiLogOut size={20} /> Logout
              </span>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className={style.mobileLink}
              >
                <FiLogIn size={20} /> Login
              </Link>
            )}
          </Link>
        </nav>
      )}

      <div className={style.headerIcons}>
        <IoSearch
          className={style.icon}
          onClick={() => setIsSearchOpen(true)}
        />
        {isSearchOpen && (
          <div className={style.searchOverlay}>
            <SearchComponent onClose={() => setIsSearchOpen(false)} />
          </div>
        )}

        <div className={`${style.userDropdown} ${style.hideOnMobile}`}>
          <LuUserRound className={style.userDropdownIcon} />
          <div className={style.userDropdownMenu}>
            {isAuthenticated && (
              <>
                <Link to="/my-account" className={style.userDropdownItem}>
                  <RxDashboard size={20} /> Dashboard
                </Link>
                <Link
                  to="/my-account/orders"
                  className={style.userDropdownItem}
                >
                  <PiNotepadLight size={20} /> Orders
                </Link>
                <Link
                  to="/my-account/downloads"
                  className={style.userDropdownItem}
                >
                  <IoDownloadOutline size={20} /> Downloads
                </Link>
                <Link
                  to="/my-account/addresses"
                  className={style.userDropdownItem}
                >
                  <TfiLocationPin size={20} /> Address
                </Link>
                <Link
                  to="/my-account/account-details"
                  className={style.userDropdownItem}
                >
                  <PiUserCircleLight size={20} /> Account Details
                </Link>
              </>
            )}
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
