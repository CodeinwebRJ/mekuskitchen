import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "../styles/Sidebar.module.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeBtn} onClick={onClose}>
        <h3>Cart Details</h3>
        <FaTimes />
      </div>
      <div className={styles.sidebarContent}>
        <p>No Product</p>
        <button className={styles.checkoutBtn}>RETURN TO SHOP</button>
      </div>
    </div>
  );
};

export default Sidebar;
