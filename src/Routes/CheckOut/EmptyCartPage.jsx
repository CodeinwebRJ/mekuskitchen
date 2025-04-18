import React, { useEffect } from "react";
import style from "../../styles/EmptyCartPage.module.css";
import { BsCartX } from "react-icons/bs";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";

const EmptyCartPage = () => {
  // Scroll to the empty cart page when it is rendered
  useEffect(() => {
    setTimeout(() => {
      const element = document.querySelector(`.${style.emptyCartPage}`);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        window.scrollTo({
          top: window.innerHeight * 0.3,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  return (
    <div className={style.emptyCartPage}>
      <h1 className={style.emptyCartIcon}>
        <BsCartX />
      </h1>

      <span className={style.emptyCartText}>Your cart is empty</span>

      <Link to="/product-category/food" className={style.emptyCartButton}>
        <Button text="Continue Shopping" variant="success" size="md">
          Continue Shopping
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCartPage;
