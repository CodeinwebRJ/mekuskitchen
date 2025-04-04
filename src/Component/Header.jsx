import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import styles from "../styles/Header.module.css";
import Sidebar from "../Component/Sidebar";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Et world</div>
      <nav className={styles.navLinks}>
        <Link to="/" className={styles.link}>
          HOME
        </Link>
        <div
          className={styles.menuWrapper}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <Link className={styles.link}>
            OUR MENU
          </Link>
          {showMenu && (
            <div className={styles.dropdownMenu}>
              <Link to="/product-category/food" className={styles.dropdownItem}>
                Food
              </Link>
              <Link
                to="/product-category/grocery"
                className={styles.dropdownItem}
              >
                Grocery
              </Link>
            </div>
          )}
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
        <FaSearch className={styles.icon} />
        <FaUser className={styles.icon} />
        <div className={styles.cart} onClick={toggleSidebar}>
          <FaShoppingCart className={styles.icon} />
          <span className={styles.cartCount}>{cartCount}</span>
        </div>
        <span className={styles.cartTotal}>${cartTotal.toFixed(2)}</span>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Header;
