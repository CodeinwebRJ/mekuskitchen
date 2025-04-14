import React from "react";
import style from "../styles/ShowProducts.module.css";

const ShowProducts = (props) => {
  const {
    isActivePerPageProducts,
    setIsActivePerPageProducts,
  } = props;

  return (
    <div className={style.showOptions}>
      <span>Show: </span>
      <span> 9 / 12 / 18 / 24</span>
    </div>
  );
};

export default ShowProducts;
