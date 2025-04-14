import React, { useState } from "react";
import styles from "../styles/Header.module.css";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import Sidebar from "../Component/Sidebar";
import { setCategory } from "../../Store/Slice/ProductSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
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

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src="/logo2.png" alt="logo" className={styles.logoImage} />
      </Link>

      <nav className={styles.navLinks}>
        <Link to="/" className={styles.link}>
          HOME
        </Link>

        <div className={styles.ourMenuDropdown}>
          <span className={styles.ourMenuDropdownLink}>OUR MENU</span>
          <div className={styles.ourMenuDropdownMenu}>
            {data?.map((item) => (
              <Link
                to={`/product-category/${item.value}`}
                className={styles.ourMenuDropdownItem}
                onClick={() => handleCategoryClick(item.value)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <Link to="/daily-tiffin" className={styles.link}>
          DAILY TIFFIN
        </Link>
        <Link to="/about-us" className={styles.link}>
          ABOUT US
        </Link>
        <Link to="/contact-us" className={styles.link}>
          CONTACT US
        </Link>
      </nav>

      <div className={styles.headerIcons}>
        <IoSearch className={styles.icon} />

        <div className={styles.userDropdown}>
          <LuUserRound className={styles.userDropdownIcon} />
          <div className={styles.userDropdownMenu}>
            <Link to="/" className={styles.userDropdownItem}>
              Dashboard
            </Link>
            <span className={styles.userDropdownItem}>Orders</span>
            <span className={styles.userDropdownItem}>Downloads</span>
            <span className={styles.userDropdownItem}>Address</span>
            <span className={styles.userDropdownItem}>Account Details</span>
            <span className={styles.userDropdownItem}>Logout</span>
          </div>
        </div>

        <div className={styles.cart} onClick={toggleSidebar}>
          <PiShoppingCartSimpleBold className={styles.icon} />
          <span className={styles.cartCount}>{cartCount}</span>
        </div>

        <span className={styles.cartTotal}>${cartTotal.toFixed(2)}</span>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Header;
