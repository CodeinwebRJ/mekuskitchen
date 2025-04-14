import React from "react";
import style from "../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { format } from "date-fns";

const TiffinCard = (props) => {
  const { item } = props;

  const formattedDate = item?.date
    ? format(new Date(item.date), "dd MMM yyyy")
    : null;

  return (
    // <Link
    //   to={`/product/${product?.category.toLowerCase()}/${product.title.toLowerCase()}`}
    //   state={{ id: product._id }}
    // >
    <div className={style.tiffinCard}>
      <div className={style.tiffinImgContainer}>
        <img
          src={item?.image_url[0] || ""}
          alt={item?.title}
          className={style.tiffinImg}
        />

        {item?.date && (
          <span className={style.tiffinDate}>D: {formattedDate}</span>
        )}
      </div>

      <p className={style.tiffinTitle}>{item?.title}</p>
      {item?.subTotal && (
        <p className={style.price}>${Number(item?.subTotal).toFixed(2)}</p>
      )}

      <AddToCartButton onclick={() => {}} />
    </div>
    // </Link>
  );
};

export default TiffinCard;
