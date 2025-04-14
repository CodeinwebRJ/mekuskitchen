import React from "react";
import style from "../styles/RatingStar.module.css";
import Rating from "react-rating";
import { FiStar } from "react-icons/fi";
import { GoStarFill } from "react-icons/go";

const RatingStar = (props) => {
  const {
    rating = 0,
    start = 0,
    stop = 5,
    fractions = 2,
    onChange = () => {},
  } = props;

  return (
    <Rating
      emptySymbol={<FiStar className={style.unFill} />}
      fullSymbol={<GoStarFill className={style.fill} />}
      fractions={fractions}
      initialRating={rating}
      start={start}
      stop={stop}
      onChange={onChange}
    />
  );
};

export default RatingStar;
