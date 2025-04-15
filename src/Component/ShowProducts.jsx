import React, { useState } from "react";
import style from "../styles/ShowProducts.module.css";

const ShowProducts = () => {
  const [isActive, setIsActive] = useState(9);

  const handleActive = (value) => {
    setIsActive(value);
  };

  return (
    <div className={style.showOptionsContainer}>
      <p className={style.showOptionsText}>Show: </p>
      <p className={style.showOptionsItems}>
        <span
          className={
            isActive === 9 ? style.showOptionsActive : style.showOptions
          }
          onClick={() => handleActive(9)}
        >
          9
        </span>{" "}
        /{" "}
        <span
          className={
            isActive === 12 ? style.showOptionsActive : style.showOptions
          }
          onClick={() => handleActive(12)}
        >
          12
        </span>{" "}
        /{" "}
        <span
          className={
            isActive === 18 ? style.showOptionsActive : style.showOptions
          }
          onClick={() => handleActive(18)}
        >
          18
        </span>{" "}
        /{" "}
        <span
          className={
            isActive === 24 ? style.showOptionsActive : style.showOptions
          }
          onClick={() => handleActive(24)}
        >
          24
        </span>
      </p>
    </div>
  );
};

export default ShowProducts;
