import React from "react";
import style from "../../styles/RelatedProductCard.module.css";
import AddToCartButton from "../Buttons/AddToCartButton";
import { Link, useLocation } from "react-router-dom";
import { formatDate } from "../../Utils/FormateDate";
import DateChip from "../Buttons/DateChip";

const RelatedProductCard = ({ item = {} }) => {
  const { pathname } = useLocation();
  const category = pathname.split("/").filter(Boolean);

  const isTiffin = category[1] === "tiffin";
  const linkPath = isTiffin
    ? `/product/tiffin/${String(item.day || "").toLowerCase()}`
    : `/product/${(item?.category || "").toLowerCase()}/${String(
        item?.name || ""
      ).toLowerCase()}`;

  const imageUrl = isTiffin
    ? item?.image_url?.[0]?.url
    : item?.images?.[0]?.url;

  const displayTitle = isTiffin ? item?.day : item?.name;
  const displayPrice = isTiffin
    ? Number(item?.subTotal || 0).toFixed(2)
    : Number(item?.price || 0).toFixed(2);

  return (
    <Link to={linkPath} state={{ id: item?._id }}>
      <div className={style.relatedProductCard}>
        <div className={style.relatedProductImgWrapper}>
          <img
            src={imageUrl || "/defaultImage.png"}
            alt={displayTitle || "Product Image"}
            className={style.relatedProductImg}
          />
          {item?.date && (
            <div className={style.dateChipWrapper}>
              <DateChip name={formatDate(item.date)} />
            </div>
          )}
        </div>
        <div className={style.contentWrapper}>
          <p className={style.relatedProductTitle}>
            {displayTitle || "Unnamed Product"}
          </p>
          <p className={style.relatedProductPrice}>${displayPrice}</p>
          <AddToCartButton onClick={() => {}} />
        </div>
      </div>
    </Link>
  );
};

export default RelatedProductCard;
