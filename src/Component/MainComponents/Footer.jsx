// src/Footer.js
import React from "react";
import styles from "../../styles/Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* About Column */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>About Meku's Kitchen</h3>
          <p className={styles.footerText}>
            Discover a culinary journey like no other at Meku’s Kitchen. Our
            passion for food and commitment to excellence are evident in every
            dish we create. Whether you’re celebrating a special occasion or
            simply craving a memorable dining experience, we invite you to savor
            the flavors of our carefully crafted menu.
          </p>
          <button className={styles.readMoreBtn}>
            Read More <span className={styles.arrowIcon}>→</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Quick Links</h3>
          <ul className={styles.footerList}>
            <li><a href="#" className={styles.footerLink}><span className={styles.arrow}>›</span> Home</a></li>
            <li><a href="#" className={styles.footerLink}><span className={styles.arrow}>›</span> Our Menu</a></li>
            <li><a href="#" className={styles.footerLink}><span className={styles.arrow}>›</span> Daily Tiffin</a></li>
            <li><a href="#" className={styles.footerLink}><span className={styles.arrow}>›</span> About Us</a></li>
            <li><a href="#" className={styles.footerLink}><span className={styles.arrow}>›</span> Contact Us</a></li>
            <li><Link to="/privacy-policy" className={styles.footerLink}><span className={styles.arrow}>›</span> Privacy Policy</Link></li>
            <li><Link to="/refund-policy" className={styles.footerLink}><span className={styles.arrow}>›</span> Refund Policy</Link></li>
          </ul>
        </div>

        {/* Product Links */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Our Product</h3>
          <ul className={styles.footerList}>
            {["Vada Pav", "Dabeli", "Dalvada", "Bread Pakoda", "Shrikhand Puri & Aloo Sabji", "Chole Puri", "Roti", "Thepla"].map((item) => (
              <li key={item}>
                <a href="#" className={styles.footerLink}>
                  <span className={styles.arrow}>›</span> {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Get in Touch</h3>
          <p className={styles.footerText}><span className={styles.icon}>📞</span> +1(672)-377-1949</p>
          <p className={styles.footerText}><span className={styles.icon}>✉️</span> mekuskitchen@gmail.com</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={styles.footerBottom}>
        <p className={styles.footerText}>
          © {new Date().getFullYear()} Meku’s Kitchen. All Rights Reserved. Developed by Node Solutions Ltd.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
