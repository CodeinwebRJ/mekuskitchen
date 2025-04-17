import React from "react";
import style from "../styles/ProductCard.module.css";
import { Link } from "react-router-dom";
import RatingStar from "../Component/RatingStar";
import AddToCartButton from "./AddToCartButton";
import { useSelector } from "react-redux";
import { AddtoCart } from "../axiosConfig/AxiosConfig";

const ProductCard = (props) => {
  const { product, grid } = props;
  const user = useSelector((state) => state.auth.user);

  const handleAddtoCart = async () => {
    if (!user) {
      return;
    }

    const cartItem = {
      user_id: user.userid,
      isTiffinCart: false,
      product_id: product._id,
      quantity: 1,
      price: product.price,
    };

    try {
      const res = await AddtoCart(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className={style.productCard}>
      <Link
        to={`/product/${product?.category.toLowerCase()}/${product.product_name.toLowerCase()}`}
        state={{ id: product._id }}
      >
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
          <RatingStar rating={3} start={0} stop={5} />
        </div>
        <p className={style.price}>${product.price}</p>
      </Link>
      <AddToCartButton onclick={handleAddtoCart} />
    </div>
  );
};

export default ProductCard;
