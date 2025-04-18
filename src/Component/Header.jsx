import React, { useEffect, useState } from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import Sidebar from "../Component/Sidebar";
import { setCategory } from "../../Store/Slice/ProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa6";

const Header = () => {
  // const [cartCount, setCartCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  const Cart = useSelector((state) => state.cart);

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
  };

  const totalAmount = Cart?.items?.totalAmount;

  const cartCount = Cart?.items?.items?.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

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

  // Handle Link Active
  const handleLinkActive = (link) => {
    if (link === window.location.pathname) {
      return styles.linkActive;
    }
    return styles.link;
  };

  return (
    <header className={styles.header}>
      <Link to="/home" className={styles.logo}>
        <img src="/logo2.png" alt="logo" className={styles.logoImage} />
      </Link>

      <nav className={styles.navLinks}>
        <Link
          to="/home"
          className={`${styles.link} ${handleLinkActive("/home")}`}
        >
          HOME
        </Link>

        <div className={styles.ourMenuDropdown}>
          <span className={styles.ourMenuDropdownLink}>OUR MENU</span>
          <div className={styles.ourMenuDropdownMenu}>
            {data?.map((item, index) => (
              <Link
                key={index}
                to={`/product-category/${item.value}`}
                className={styles.ourMenuDropdownItem}
                onClick={() => handleCategoryClick(item.value)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Link
          to="/daily-tiffin"
          className={`${styles.link} ${handleLinkActive("/daily-tiffin")}`}
        >
          DAILY TIFFIN
        </Link>
        <Link
          to="/about-us"
          className={`${styles.link} ${handleLinkActive("/about-us")}`}
        >
          ABOUT US
        </Link>
        <Link
          to="/contact-us"
          className={`${styles.link} ${handleLinkActive("/contact-us")}`}
        >
          CONTACT US
        </Link>
      </nav>

      <div className={styles.headerIcons}>
        <IoSearch className={styles.icon} />

        <div className={styles.userDropdown}>
          <LuUserRound className={styles.userDropdownIcon} />
          <div className={styles.userDropdownMenu}>
            <Link to="/my-account" className={styles.userDropdownItem}>
              Dashboard
            </Link>
            <Link to="/my-account/orders" className={styles.userDropdownItem}>
              Orders
            </Link>
            <Link
              to="/my-account/downloads"
              className={styles.userDropdownItem}
            >
              Downloads
            </Link>
            <Link
              to="/my-account/addresses"
              className={styles.userDropdownItem}
            >
              Address
            </Link>
            <Link
              to="/my-account/account-details"
              className={styles.userDropdownItem}
            >
              Account Details
            </Link>
            <span className={styles.userDropdownItem}>Logout</span>
          </div>
        </div>

        <Link to="/wishlist" className={styles.wishlist}>
          <FaRegHeart className={styles.icon} />
        </Link>

        <div className={styles.cart} onClick={() => setIsSidebarOpen(true)}>
          <PiShoppingCartSimpleBold className={styles.icon} />
          <span className={styles.cartCount}>{cartCount ?? 0}</span>
        </div>

        <span className={styles.cartTotal}>
          ${totalAmount ?? (0).toFixed(2)}
        </span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default Header;
