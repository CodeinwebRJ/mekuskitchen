import { Link } from "react-router-dom";
import styles from "../../styles/Footer.module.css";
import { IoMdCall } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>
            About <span className={styles.highlight}>Meku's Kitchen</span>
          </h3>
          <p className={styles.footerText}>
            Discover a culinary journey like no other at Meku’s Kitchen. Our
            passion for food and commitment to excellence are evident in every
            dish we create. Whether you're celebrating a special occasion or
            simply craving a memorable dining experience, we invite you to savor
            the flavors of our carefully crafted menu.
          </p>
          <button className={styles.readMoreBtn}>Read More</button>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>
            <span className={styles.quickText}>Quick</span> Links
          </h3>
          <div className={styles.linkList}>
            <Link to="/">Home</Link>
            <Link to="/product-category">Our Menu</Link>
            <Link to="/daily-tiffin">Daily Tiffin</Link>
            <Link to="/about-us">About Us</Link>
            <Link to="/contact-us">Contact Us</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/refund-policy">Refund policy</Link>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>
            Get in <span className={styles.highlight}>Touch</span>
          </h3>
          <p className={styles.contactLine}>
            <IoMdCall size={18} /> <span>+1(672)-377-4949</span>
          </p>
          <p className={styles.contactLine}>
            <IoMail size={18} /> <span>mekuskitchen@gmail.com</span>
          </p>
          <p className={styles.followUs}>
            <strong>Follow us on:</strong>
          </p>
          <div className={styles.socialIcons}>
            <Link to="#">
              <FaFacebookF />
            </Link>
            <Link to="#">
              <FaInstagram />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
