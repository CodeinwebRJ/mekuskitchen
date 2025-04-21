import React, { useEffect } from "react";
import style from "../../styles/EmptyCartPage.module.css";
import { BsCartX } from "react-icons/bs";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";

const EmptyCartPage = () => {

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
