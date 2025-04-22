import React from "react";
import style from "../../styles/WishlistItem.module.css";
import RatingStar from "../RatingStar";
import { RiShareLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "../Buttons/Button";

const WishlistItem = (props) => {
  const { product } = props;

  return (
    <div className={style.borderBottom}>
      <div className={style.item}>
        <div className={style.itemLeftSide}>
          <div className={style.itemImage}>
            <img
              src={`${product?.productId?.image_url[0]}`}
              alt="wishlist-item"
            />
          </div>
          <div className={style.itemContent}>
            <span className={style.itemName}>
              {product?.productId?.product_name.toUpperCase()}
            </span>
            <span className={style.itemDescription}>
              {product?.productId?.description}
            </span>
            <span className={style.itemPrice}>
              ${product?.productId?.price}
            </span>
          </div>
        </div>

        <div className={style.itemRightSide}>
          <div className={style.stockContainer}>
            <span className={style.stockTitle}>In Stock</span>
            <RatingStar start={0} stop={5} rating={3} disabled={true} />

            <div className={style.controllers}>
              <RiShareLine className={style.icon} />
              <AiOutlineDelete className={style.icon} />
            </div>
          </div>

          <Button variant="primary" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
