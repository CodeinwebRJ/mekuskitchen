import React from "react";
import style from "../../styles/RelatedProductCard.module.css";
import AddToCartButton from "../Buttons/AddToCartButton";
import { Link, useLocation } from "react-router-dom";
import { formatDate } from "../../Utils/FormateDate";

const RelatedProductCard = (props) => {
  const { item } = props;

  const { pathname } = useLocation();
  const category = pathname.split("/").filter((segment) => segment);

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
          {item?.date && <DateChip name={formatDate(item?.date)} />}
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
