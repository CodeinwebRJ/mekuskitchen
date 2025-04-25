import React, { useEffect, useCallback } from "react";
import style from "../../styles/ProductCard.module.css";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import AddToCartButton from "../Buttons/AddToCartButton";
import { useSelector, useDispatch } from "react-redux";
import {
  AddtoCart,
  AddtoWishlist,
  getUserWishlist,
  RemoveWishlist,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import {
  setWishlist,
  toggleLiked,
} from "../../../Store/Slice/UserWishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Toast } from "../../Utils/Toast";

const ProductCard = ({ product, grid }) => {
  const user = useSelector((state) => state.auth.user);
  const isLiked = useSelector(
    (state) => state.wishlist?.likedMap?.[product._id]
  );
  const dispatch = useDispatch();

  const Cart = useSelector((state) => state.cart);

  const handleAddToCart = async () => {
    if (!user) return;
    if (Cart?.items?.tiffins.length > 0) {
      Toast({
        message: "Tiffin is already added to cart!",
        type: "error",
      });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity: 1,
        price: product.price,
      });
      dispatch(setCart(res.data.data));
      Toast({
        message: "Product added to cart suceessfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({
        message: "Failed to add product in cart.",
        type: "error",
      })
    }
  };

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await getUserWishlist(user.userid);
      dispatch(setWishlist(res.data.data));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [user, dispatch]);

  const handleWishlistToggle = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await RemoveWishlist({ userid: user.userid, product_id: product._id });
      } else {
        await AddtoWishlist({ userid: user.userid, product_id: product._id });
      }
      dispatch(toggleLiked(product._id));
      fetchWishlist();
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  return (
    <>
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
          <p className={style.productName}>{product?.product_name}</p>
          <div className={style.rating}>
            <RatingStar rating={3} start={0} stop={5} disabled />
          </div>
          <p className="price">${product.price}</p>
        </Link>

        <div className={style.wishlist} onClick={handleWishlistToggle}>
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        </div>

        <AddToCartButton onclick={handleAddToCart} />
      </div>
    </>
  );
};

export default ProductCard;
