import style from "../../styles/RelatedProductCard.module.css";
import AddToCartButton from "../Buttons/AddToCartButton";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  RemoveWishlist,
  AddtoWishlist,
  AddtoCart,
} from "../../axiosConfig/AxiosConfig";
import {
  setWishlist,
  toggleLiked,
} from "../../../Store/Slice/UserWishlistSlice";
import { Toast } from "../../Utils/Toast";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import RatingStar from "../RatingStar";
import { setWishlistCount } from "../../../Store/Slice/CountSlice";
import { useEffect, useState } from "react";

const RelatedProductCard = ({ item }) => {
  const { pathname } = useLocation();
  const category = pathname.split("/").filter(Boolean);
  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[item._id]
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const isLiked = isAuthenticated ? isLikedFromStore : isLikedLocal;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((loc) => loc._id === item._id);
      setIsLikedLocal(exists);
    }
  }, [item._id, user, isLikedFromStore]);

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
    : Number(item?.sellingPrice || 0).toFixed(2);

  const displayOrignalPrice = isTiffin
    ? ""
    : Number(item?.sellingPrice || 0).toFixed(2);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === item._id);

      if (exists) {
        const updatedWishlist = localWishlist.filter(
          (item) => item._id !== item._id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsLikedLocal(false);
        Toast({ message: "Removed from wishlist!", type: "success" });
        dispatch(setWishlist(updatedWishlist));
        dispatch(setWishlistCount(updatedWishlist.length));
      } else {
        localWishlist.push(item);
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        setIsLikedLocal(true);
        Toast({ message: "Added to wishlist!", type: "success" });
        dispatch(setWishlist(localWishlist));
        dispatch(setWishlistCount(localWishlist.length));
      }
      return;
    }
    try {
      if (isLiked) {
        await RemoveWishlist({ userid: user.userid, productId: item._id });
      } else {
        await AddtoWishlist({ userid: user.userid, productId: item._id });
      }
      dispatch(toggleLiked(item._id));
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    if (Cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }
    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: item._id,
        quantity: 1,
        price: item.sellingPrice,
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product in cart.", type: "error" });
    }
  };


  return (
    <Link to={linkPath} state={{ id: item?._id }}>
      <div className={style.relatedProductCard}>
        <div className={style.relatedProductImgWrapper}>
          <img
            src={imageUrl || "/defaultImage.png"}
            alt={displayTitle || "Product Image"}
            className={style.relatedProductImg}
          />
        </div>
        <div className={style.wishlist} onClick={handleWishlistToggle}>
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        </div>
        <div className={style.contentWrapper}>
          <p className={style.relatedProductTitle}>
            {displayTitle || "Unnamed Product"}
          </p>
          <div className={style.rating}>
            <RatingStar
              rating={item?.averageRating}
              start={0}
              stop={5}
              disabled
            />
          </div>
          <div className={style.PriceContainer}>
            <p className="originalPrice">${displayPrice}</p>
            <p className="price">
              ${displayPrice} {item?.currency || "CAD"}{" "}
            </p>
          </div>
          <AddToCartButton onclick={handleAddToCart} />
        </div>
      </div>
    </Link>
  );
};

export default RelatedProductCard;
