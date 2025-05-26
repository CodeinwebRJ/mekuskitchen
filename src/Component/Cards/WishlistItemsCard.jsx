import React from "react";
import style from "../../styles/WishlistItem.module.css";
import RatingStar from "../RatingStar";
import { RiShareLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import Button from "../Buttons/Button";
import { AddtoCart, RemoveWishlist } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../Utils/Toast";

const WishlistItem = ({ product, fetchWishlist }) => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!user) return;

    if (cartItems?.tiffins?.length > 0) {
      return Toast({
        message: "Tiffin is already added to cart!",
        type: "error",
      });
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: _id,
        quantity: 1,
        price,
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product to cart.", type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await RemoveWishlist({ userid: user.userid, productId: product._id });
      Toast({ message: "Item removed from wishlist.", type: "success" });
      fetchWishlist();
    } catch (error) {
      console.error("Error deleting item from wishlist", error);
      Toast({ message: "Failed to remove from wishlist.", type: "error" });
    }
  };

  return (
    <div className={style.item}>
      <div className={style.itemLeftSide}>
        <div className={style.itemImage}>
          <img
            src={product.images?.[0]?.url || "defultImage.png"}
            alt={product.name || "wishlist item"}
          />
        </div>
        <div className={style.itemContent}>
          <span className={style.itemName}>{product.name?.toUpperCase()}</span>
          <span className={style.itemPrice}>${product.sellingPrice}</span>
          <span className={style.itemDescription}>{product.description}</span>
        </div>
      </div>

      <div className={style.itemRightSide}>
        <div className={style.stockContainer}>
          <span className={style.stockTitle}>In Stock</span>
          <RatingStar start={0} stop={5} rating={3} disabled />
          <div className={style.controllers}>
            <RiShareLine className={style.icon} />
            <AiOutlineDelete onClick={handleDelete} className={style.icon} />
          </div>
        </div>

        <Button onClick={handleAddToCart} variant="primary" size="sm">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default WishlistItem;
