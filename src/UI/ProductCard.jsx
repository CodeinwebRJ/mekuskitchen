import React from "react";
import style from "../styles/ProductCard.module.css";
import { Link } from "react-router-dom";
import RatingStar from "../Component/RatingStar";

const ProductCard = (props) => {
  const { product, grid } = props;

  return (
    <Link
      to={`/product/${product?.category.toLowerCase()}/${product.product_name.toLowerCase()}`}
      state={{ id: product._id }}
    >
      <div className={style.productCard}>
        <img
          src={product.image_url?.[0] || ""}
          alt={product.product_name}
          className={
            grid === 2
              ? style.productImg2
              : grid === 3
              ? style.productImg3
              : grid === 4
              ? style.productImg4
              : style.productImg3
          }
        />
        <p className={style.productName}>{product.product_name}</p>
        <div className={style.rating}>
          {/* Rating */}
          <RatingStar rating={3} start={0} stop={5} />
        </div>
        <p className={style.price}>${product.price}</p>
        <button className={style.addToCart}>ADD TO CART</button>
      </div>
    </Link>
  );
};

export default ProductCard;
