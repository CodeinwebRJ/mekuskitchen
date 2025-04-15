import React from "react";
import style from "../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { format } from "date-fns";

const TiffinCard = (props) => {
  const { item } = props;

  const formattedDate = item?.date
    ? format(new Date(item.date), "MM/dd/yyyy")
    : "N/A";

  console.log(item);

  return (
    <Link
      to={`/product/tiffin/${String(item.day).toLowerCase()}`}
      state={{ id: item._id }}
    >
      <div className={style.tiffinCard}>
        <div className={style.tiffinImgContainer}>
          <img
            src={item?.image_url[0] || ""}
            alt={item?.product_name}
            className={style.tiffinImg}
          />

          {item?.date && (
            <span className={style.tiffinDate}>D: {formattedDate}</span>
          )}
        </div>

        <p className={style.tiffinTitle}>{item?.product_name}</p>
        {item?.price && (
          <p className={style.price}>${Number(item?.price).toFixed(2)}</p>
        )}

        <AddToCartButton onclick={() => {}} />
      </div>
    </Link>
  );
};

export default TiffinCard;
