import { Link } from "react-router-dom";
import style from "../../styles/Footer.module.css";
import { IoMdCall } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import {
  FaHome,
  FaUtensils,
  FaInfoCircle,
  FaPhoneAlt,
  FaShieldAlt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { GiMeal } from "react-icons/gi";

const Footer = () => {
  return (
    <footer className={style.footerContainer}>
      <div className={style.footerInner}>
        <div className={style.footerColumn}>
          <h2 className={style.footerTitle}>About Meku's Kitchen</h2>
          <p className={style.footerText}>
            Discover a culinary journey like no other at Meku’s Kitchen. Our
            passion for food and commitment to excellence are evident in every
            dish we create. Whether you're celebrating a special occasion or
            simply craving a memorable dining experience, we invite you to savor
            the flavors of our carefully crafted menu.
          </p>
          <Link to="/about-us" className={style.readMoreBtn}>
            Read More
          </Link>
        </div>

        <div className={style.footerColumn}>
          <h2 className={style.footerTitle}>Quick Links</h2>
          <nav className={style.linkList} aria-label="Footer Navigation">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <FaHome />
              <span className={style.listName}>Home</span>
            </Link>
            <Link to="/product-category">
              <FaUtensils />
              <span className={style.listName}>Our Product</span>
            </Link>
            <Link to="/daily-tiffin">
              <GiMeal />
              <span className={style.listName}>Daily Tiffin</span>
            </Link>
            <Link to="/about-us">
              <FaInfoCircle />
              <span className={style.listName}>About Us</span>
            </Link>
            <Link to="/contact-us">
              <FaPhoneAlt />
              <span className={style.listName}>Contact Us</span>
            </Link>
            <Link to="/privacy-policy">
              <FaShieldAlt />
              <span className={style.listName}>Privacy Policy</span>
            </Link>
            <Link to="/refund-policy">
              <FaMoneyCheckAlt />
              <span className={style.listName}>Refund Policy</span>
            </Link>
          </nav>
        </div>
        <div className={style.footerColumn}>
          <h2 className={style.footerTitle}>Get in Touch</h2>
          <p className={style.contactLine}>
            <IoMail size={18} />
            <a
              href="mailto:mekuskitchen@gmail.com"
              className={style.mailLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              mekuskitchen@gmail.com
            </a>
          </p>

          <p className={style.followUs}>
            <strong>Follow us on:</strong>
          </p>
          <div className={style.socialIcons}>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img src="/facebook.png" alt="Facebook" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img src="/instagram.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
