import React from "react";
import styles from "../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import Button from "../UI/Button";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeBtn} onClick={onClose}>
        <h5>SHOPPING CART</h5>
        <FaTimes className={styles.closeIcon} />
      </div>

      <div className={styles.cartContainer}>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div className={styles.cartItem} key={index}>
              <div className={styles.cartItemImageContainer}>
                <img
                  src="/MasalaParatha.jpg"
                  alt="image 1"
                  className={styles.cartItemImage}
                />
              </div>

              <div className={styles.cartItemDetails}>
                <p className={styles.cartItemName}>Masala Paratha</p>
                <p className={styles.cartItemCalculation}>
                  <span className={styles.quantity}>1</span>
                  <span className={styles.multiply}>×</span>
                  <span className={styles.price}>$3.20</span>
                </p>

                <RiDeleteBin5Fill className={styles.deleteIcon} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.cartItemSubtotal}>
        <div className={styles.subtotalContainer}>
          <h5 className={styles.subtotalText}>SUBTOTAL:</h5>
          <h5 className={styles.subtotalPrice}>$3.20</h5>
        </div>

        <div className={styles.subtotalButtons}>
          <Link to={"/cart"}>
            <Button variant="light">VIEW CART</Button>
          </Link>
          <Button variant="primary">CHECKOUT</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
