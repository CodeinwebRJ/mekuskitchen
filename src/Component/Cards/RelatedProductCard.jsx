import React from "react";
import style from "../../styles/RelatedProductCard.module.css";
import AddToCartButton from "../Buttons/AddToCartButton";
import { format } from "date-fns";
import { Link, useLocation } from "react-router-dom";

const RelatedProductCard = (props) => {
  const { item } = props;

  const { pathname } = useLocation();
  const category = pathname.split("/").filter((segment) => segment);

  const formattedDate = item?.date
    ? format(new Date(item.date), "MM/dd/yyyy")
    : "N/A";

  return (
    <Link
      to={
        category[1] === "tiffin"
          ? `/product/tiffin/${String(item.day).toLowerCase()}`
          : `/product/${item?.category.toLowerCase()}/${String(
              item.product_name
            ).toLowerCase()}`
      }
      state={{ id: item._id }}
    >
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
        <p className={style.relatedProductTitle}>
          {category[1] === "tiffin" ? item?.day : item?.product_name}
        </p>
        <p className={style.relatedProductPrice}>
          $
          {category[1] === "tiffin"
            ? Number(item.subTotal)
            : Number(item?.price).toFixed(2)}
        </p>
        <AddToCartButton onclick={() => {}} />
      </div>
    </Link>
  );
};

export default RelatedProductCard;
