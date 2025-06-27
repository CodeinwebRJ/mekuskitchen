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

const Footer = () => {
  return (
    <footer className={style.footerContainer}>
      <div className={style.footerInner}>
        <div className={style.footerColumn}>
          <h3 className={style.footerTitle}>
            <span className={style.highlight}>About </span> Meku's{" "}
            <span className={style.highlight}>Kitchen</span>
          </h3>
          <p className={style.footerText}>
            Discover a culinary journey like no other at Meku’s Kitchen. Our
            passion for food and commitment to excellence are evident in every
            dish we create. Whether you're celebrating a special occasion or
            simply craving a memorable dining experience, we invite you to savor
            the flavors of our carefully crafted menu.
          </p>
          <Link to={"/about-us"}>
            <button className={style.readMoreBtn}>Read More</button>
          </Link>
        </div>

        <div className={style.footerColumn}>
          <h3 className={style.footerTitle}>
            Quick <span className={style.highlight}> Links</span>
          </h3>
          <div className={style.linkList}>
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <FaHome />
              <div className={style.listName}>Home</div>
            </Link>

            <Link to="/product-category">
              <FaUtensils />
              <div className={style.listName}>Our Product</div>
            </Link>
            {/* <Link to="/daily-tiffin">
              <MdOutlineLunchDining />
              <div>Daily Tiffin</div>
            </Link> */}
            <Link to="/about-us">
              <FaInfoCircle />
              <div className={style.listName}>About Us</div>
            </Link>
            <Link to="/contact-us">
              <FaPhoneAlt />
              <div className={style.listName}>Contact Us</div>
            </Link>
            <Link to="/privacy-policy">
              <FaShieldAlt />
              <div className={style.listName}>Privacy Policy</div>
            </Link>
            <Link to="/refund-policy">
              <FaMoneyCheckAlt />{" "}
              <div className={style.listName}>Refund Policy</div>
            </Link>
          </div>
        </div>

        <div className={style.footerColumn}>
          <h3 className={style.footerTitle}>
            Get in <span className={style.highlight}>Touch</span>
          </h3>
          <p className={style.contactLine}>
            <IoMdCall size={18} /> <span>+1(672)-377-4949</span>
          </p>
          <p className={style.contactLine}>
            <IoMail size={18} />
            <Link
              to="https://mail.google.com/mail/?view=cm&fs=1&to=mekuskitchen@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className={style.mailLink}
            >
              mekuskitchen@gmail.com
            </Link>
          </p>

          <p className={style.followUs}>
            <strong>Follow us on:</strong>
          </p>
          <div className={style.socialIcons}>
            <Link to="#">
              <img src="/facebook.png" alt="Facebook" />
            </Link>
            <Link to="#">
              <img src="/instagram.png" alt="Facebook" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
