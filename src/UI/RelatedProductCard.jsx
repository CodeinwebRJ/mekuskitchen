import React from "react";
import style from "../styles/RelatedProductCard.module.css";
import AddToCartButton from "./AddToCartButton";
import { format } from "date-fns";

const RelatedProductCard = (props) => {
  const { item } = props;

  const formattedDate = item?.date
    ? format(new Date(item.date), "MM/dd/yyyy")
    : "N/A";

    console.log(item)

  return (
    // <Link
    //   to={`/product/${product?.category.toLowerCase()}/${product.title.toLowerCase()}`}
    //   state={{ id: product._id }}
    // >
    <div className={style.relatedProductCard}>
      <div className={style.relatedProductImgContainer}>
        <img
          src={item?.image_url[0] || ""}
          alt={item?.product_name}
          className={style.relatedProductImg}
        />

        {item?.date && (
          <span className={style.relatedProductDate}>D: {formattedDate}</span>
        )}
      </div>

      <p className={style.relatedProductTitle}>{item?.product_name}</p>
      {item?.price && (
        <p className={style.relatedProductPrice}>
          ${Number(item?.price).toFixed(2)}
        </p>
      )}

      <AddToCartButton onclick={() => {}} />
    </div>
    // </Link>
  );
};

export default RelatedProductCard;
