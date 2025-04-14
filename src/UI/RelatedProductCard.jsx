import React from "react";
import style from "../styles/RelatedProductCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

const RelatedProductCard = (props) => {
  const { item } = props;

  return (
    // <Link
    //   to={`/product/${product?.category.toLowerCase()}/${product.title.toLowerCase()}`}
    //   state={{ id: product._id }}
    // >
    <div className={style.relatedProductCard}>
      <div className={style.relatedProductImgContainer}>
        <img
          src={item?.image || ""}
          alt={item?.title}
          className={style.relatedProductImg}
        />

        {item?.date && (
          <span className={style.relatedProductDate}>D: {item?.date}</span>
        )}
      </div>

      <p className={style.relatedProductTitle}>{item?.title}</p>
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
