import React from "react";
import style from "../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

const TiffinCard = (props) => {
  const { item } = props;

  return (
    // <Link
    //   to={`/product/${product?.category.toLowerCase()}/${product.title.toLowerCase()}`}
    //   state={{ id: product._id }}
    // >
    <div className={style.tiffinCard}>
      <div className={style.tiffinImgContainer}>
        <img
          src={item?.image || ""}
          alt={item?.title} 
          className={style.tiffinImg}
        />

        {item?.date && (
          <span className={style.tiffinDate}>D: {item?.date}</span>
        )}
      </div>

      <p className={style.tiffinTitle}>{item?.title}</p>
      {item?.price && (
        <p className={style.price}>${Number(item?.price).toFixed(2)}</p>
      )}

      <AddToCartButton onclick={() => {}} />
    </div>
    // </Link>
  );
};

export default TiffinCard;
