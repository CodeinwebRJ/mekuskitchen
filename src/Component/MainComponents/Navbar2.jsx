import { Link, NavLink } from "react-router-dom";
import styles from "../../styles/Navbar2.module.css";

function Navbar2() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <NavLink to="/" className={styles.logoLink}>
          <img
            src="/logo.jpg"
            alt="mekuskitchen Logo"
            className={styles.logoImage}
          />
        </NavLink>
      </div>

      <div className={styles.collapse}>
        <div className={styles.nav}>
          <div className={styles.authButtons}>
            <Link to="/login" className={styles.btn}>
              Login
            </Link>
            <Link to="/signup" className={styles.btn}>
              Signup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
