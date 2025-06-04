import { FaPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import style from "../../styles/HomeProductCard.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import {
  AddtoCart,
  AddtoWishlist,
  RemoveWishlist,
} from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import {
  setWishlist,
  toggleLiked,
} from "../../../Store/Slice/UserWishlistSlice";
import { setWishlistCount } from "../../../Store/Slice/CountSlice";
import { useState } from "react";

export const HomeProductCard = ({
  data,
  image,
  name,
  subtitle,
  price,
  alt,
}) => {
  const imageUrl =
    Array.isArray(image) && image.length > 0 && image[0]?.url
      ? image[0].url
      : "/defultImage.png";

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[data?._id] || false
  );
  const cart = useSelector((state) => state.cart);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const dispatch = useDispatch();
  const isLiked = isAuthenticated ? isLikedFromStore : isLikedLocal;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data?._id) {
      Toast.error("Invalid product data");
      return;
    }

    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = localCart.find((item) => item._id === data._id);

      if (exists) {
        const updatedCart = localCart.map((item) =>
          item._id === data._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({
          message: "Product quantity updated in cart!",
          type: "success",
        });
        dispatch(setCart(updatedCart));
      } else {
        localCart.push({
          ...data,
          quantity: 1,
          price: data.price || price || 0, // Fallback to 0 if price is undefined
        });
        localStorage.setItem("cart", JSON.stringify(localCart));
        Toast({ message: "Product added to cart!", type: "success" });
        dispatch(setCart(localCart));
      }
      return;
    }

    if (cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user?.userid,
        isTiffinCart: false,
        product_id: data._id,
        quantity: 1,
        price: data.price || price || 0, // Fallback to 0 if price is undefined
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      Toast({
        message: "Failed to add product to cart. Please try again.",
        type: "error",
      });
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data?._id) {
      Toast.error("Invalid product data");
      return;
    }

    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === data._id);

      if (exists) {
        const updatedWishlist = localWishlist.filter(
          (item) => item._id !== data._id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsLikedLocal(false);
        Toast({ message: "Removed from wishlist!", type: "success" });
        dispatch(setWishlist(updatedWishlist));
        dispatch(setWishlistCount(updatedWishlist.length));
      } else {
        localWishlist.push(data);
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        setIsLikedLocal(true);
        Toast({ message: "Added to wishlist!", type: "success" });
        dispatch(setWishlist(localWishlist));
        dispatch(setWishlistCount(localWishlist.length));
      }
      return;
    }

    try {
      if (isLikedFromStore) {
        await RemoveWishlist({ userid: user.userid, productId: data._id });
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        await AddtoWishlist({ userid: user.userid, productId: data._id });
        Toast({ message: "Added to wishlist!", type: "success" });
      }
      dispatch(toggleLiked(data._id));
    } catch (error) {
      console.error("Wishlist operation failed:", error.message);
      Toast({
        message: "Failed to update wishlist. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <Link
      to={`/product/${data?.category?.toLowerCase()}/${data?.name?.toLowerCase()}`}
      state={{ id: data?._id }}
      className={style.link}
    >
      <div className={style.card}>
        <div className={style.imgeContainer}>
          <img
            src={imageUrl}
            alt={alt || "Product image"}
            className={style.image}
            loading="lazy"
          />
        </div>
        <div className={style.cardContent}>
          <div className={style.content}>
            <h3 className={style.title}>{name || "Unnamed Product"}</h3>
            {subtitle && <p className={style.subtitle}>{subtitle}</p>}
            {(data?.price || price) && (
              <p className={style.price}>
                ${Number(data?.price || price).toFixed(2)}
              </p>
            )}
          </div>
          <div className={style.actions}>
            <button
              onClick={handleAddToCart}
              className={style.iconBtn}
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <FaPlus />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={style.iconBtn}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isLiked ? (
                <FaHeart size={20} color="red" />
              ) : (
                <FaRegHeart size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
