import React, { useState } from "react";
import style from "../styles/ShowProducts.module.css";
import { setLimit } from "../../Store/Slice/FilterDataSlice";
import { useDispatch, useSelector } from "react-redux";

const ShowProducts = () => {
  const { limit } = useSelector((state) => state.filterData);

  const dispatch = useDispatch();
  const handleActive = (value) => {
    dispatch(setLimit(value));
  };

  const options = [9, 12, 18, 24];

  return (
    <div className={style.showOptionsContainer}>
      <p className={style.showOptionsText}>Show: </p>
      <div className={style.showOptionsItems}>
        {options.map((option) => (
          <button
            key={option}
            className={`${style.showOptions} ${
              Number(limit) === option ? style.showOptionsActive : ""
            }`}
            onClick={() => handleActive(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowProducts;
