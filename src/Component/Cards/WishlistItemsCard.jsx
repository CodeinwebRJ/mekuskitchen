import React from "react";
import style from "../../styles/WishlistItem.module.css";
import RatingStar from "../RatingStar";
import { RiShareLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "../Buttons/Button";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../Utils/Toast";

const WishlistItem = (props) => {
  const { product } = props;
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

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
        product_id: product?.productId?._id,
        quantity: 1,
        price: product?.productId?.price,
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
      });
    }
  };

  return (
    <div>
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
            <span className={style.itemPrice}>
              ${product?.productId?.price}
            </span>
            <span className={style.itemDescription}>
              {product?.productId?.description}
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

          <Button onClick={handleAddToCart} variant="primary" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
