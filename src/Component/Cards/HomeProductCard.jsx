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
import { useEffect, useState } from "react";
import useProduct from "../../Hook/useProduct";
import RatingStar from "../RatingStar";
import slugify from "../../Utils/URLslug";

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
      : "/defaultImage.png";

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[data?._id] || false
  );
  const cart = useSelector((state) => state.cart);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const dispatch = useDispatch();
  const isLiked = isAuthenticated ? isLikedFromStore : isLikedLocal;
  const { selectedCombination, selectedSKUs, setSelectedSKUs } = useProduct(
    data._id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      const localCartData = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        tiffins: [],
      };
      const localCartItems = localCartData.items || [];
      const localCartTiffin = localCartData.tiffins || [];
      if (localCartTiffin.length > 0) {
        Toast({ message: "Tiffin is already added to cart!", type: "error" });
        return;
      }
      const exists = localCartItems.find((item) => item?._id === data?._id);
      if (exists) {
        const updatedItems = localCartItems.map((item) => {
          if (item._id === data._id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        const updatedCart = {
          items: updatedItems,
          tiffins: localCartTiffin,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({
          message: "Product quantity updated in cart!",
          type: "success",
        });
        dispatch(setCart(updatedCart));
      } else {
        const updatedItems = [
          ...localCartItems,
          { ...data, quantity: 1, price: data.price },
        ];

        const updatedCart = {
          items: updatedItems,
          tiffins: localCartTiffin,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({
          message: "Product added to cart!",
          type: "success",
        });
        dispatch(setCart(updatedCart));
      }

      return;
    }

    if (cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: data._id,
        quantity: 1,
        price: selectedCombination?.Price || data?.price,
        ...(data?.sku?.length > 1 && selectedSKUs?._id
          ? { skuId: selectedSKUs._id }
          : {}),
        ...(data.sku?.length > 1 && selectedCombination
          ? { combination: { ...selectedCombination } }
          : {}),
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product in cart.", type: "error" });
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data?._id) {
      Toast({ message: "Invalid product data", type: "error" });
      return;
    }

    const productId = data._id;

    if (!isAuthenticated) {
      let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      const exists = localWishlist.some((item) => item._id === productId);

      if (exists) {
        localWishlist = localWishlist.filter((item) => item._id !== productId);
        setIsLikedLocal(false);
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        localWishlist.push(data);
        setIsLikedLocal(true);
        Toast({ message: "Added to wishlist!", type: "success" });
      }

      localStorage.setItem("wishlist", JSON.stringify(localWishlist));
      dispatch(setWishlist(localWishlist));
      dispatch(setWishlistCount(localWishlist.length));
      return;
    }

    try {
      if (isLikedFromStore) {
        await RemoveWishlist({ userid: user.userid, productId });
        dispatch(toggleLiked(productId));
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        await AddtoWishlist({ userid: user.userid, productId });
        dispatch(toggleLiked(productId));
        Toast({ message: "Added to wishlist!", type: "success" });
      }
    } catch (error) {
      dispatch(toggleLiked(productId));
      console.error("Wishlist operation failed:", error.message);
      Toast({
        message: "Failed to update wishlist. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === data._id);
      setIsLikedLocal(exists);
    }
  }, [data._id, user]);

  useEffect(() => {
    if (data?.sku) {
      setSelectedSKUs(data?.sku[0]);
    }
  }, []);

  return (
    <Link
      to={`/product/${slugify(data?.category)}/${slugify(data?.name)}`}
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

            <div>
              <RatingStar disabled rating={data?.averageRating || 0} />
            </div>

            <div className={style.priceContainer}>
              {(data?.price || price) && (
                <p className={style.originalPrice}>
                  ${Number(data?.price || price).toFixed(2)}
                </p>
              )}
              <p className={style.price}>
                $
                {Number(
                  selectedCombination?.Price || data.sellingPrice
                ).toFixed(2)}{" "}
                {data.currency || "CAD"}
              </p>
            </div>
          </div>
          <div className={style.actions}>
            <button
              onClick={handleAddToCart}
              className={style.iconBtn}
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <FaPlus color="var(--white)" />
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
                <FaRegHeart color="var(--white)" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
