import style from "../../styles/ProductCard.module.css";
import { Link } from "react-router-dom";
import RatingStar from "../RatingStar";
import AddToCartButton from "../Buttons/AddToCartButton";
import { useSelector, useDispatch } from "react-redux";
import {
  AddtoCart,
  AddtoWishlist,
  RemoveWishlist,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import {
  setWishlist,
  toggleLiked,
} from "../../../Store/Slice/UserWishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Toast } from "../../Utils/Toast";
import { useState, useEffect } from "react";
import { setWishlistCount } from "../../../Store/Slice/CountSlice";
import useProduct from "../../Hook/useProduct";

const ProductCard = ({ product, grid }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[product._id]
  );
  const Cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const isLiked = isAuthenticated ? isLikedFromStore : isLikedLocal;

  const { selectedCombination, selectedSKUs, setSelectedSKUs } = useProduct(
    product._id
  );

  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === product._id);
      setIsLikedLocal(exists);
    }
  }, [product._id, user]);

  const handleAddToCart = async () => {
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
      const exists = localCartItems.find((item) => item?._id === product?._id);
      if (exists) {
        const updatedItems = localCartItems.map((item) => {
          if (item._id === product._id) {
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
        const modifiedSKU = selectedSKUs
          ? {
              ...selectedSKUs,
              details: {
                ...selectedSKUs.details,
                combinations: selectedCombination || undefined,
              },
            }
          : product.sku[0];

        const productWithoutSKU = { ...product, sku: undefined };
        const updatedItems = [
          ...localCartItems,
          {
            ...productWithoutSKU,
            quantity: 1,
            price: selectedCombination?.Price || product.sellingPrice,
            sku: modifiedSKU,
            ...(selectedCombination
              ? { combination: selectedCombination }
              : {}),
          },
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

    if (Cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }

    try {
      const data = {
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity: 1,
        price: selectedCombination?.Price || product?.sellingPrice,
        ...(product?.sku?.length > 0 && selectedSKUs?._id
          ? { skuId: selectedSKUs._id }
          : {}),
        ...(product.sku?.length > 0 && selectedCombination
          ? { combination: { ...selectedCombination } }
          : {}),
      };

      console.log(data.skuId)
      const res = await AddtoCart(data);
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product in cart.", type: "error" });
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === product._id);

      if (exists) {
        const updatedWishlist = localWishlist.filter(
          (item) => item._id !== product._id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsLikedLocal(false);
        Toast({ message: "Removed from wishlist!", type: "success" });
        dispatch(setWishlist(updatedWishlist));
        dispatch(setWishlistCount(updatedWishlist.length));
      } else {
        localWishlist.push(product);
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
        await RemoveWishlist({ userid: user.userid, productId: product._id });
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        await AddtoWishlist({ userid: user.userid, productId: product._id });
        Toast({ message: "Added to wishlist!", type: "success" });
      }
      dispatch(toggleLiked(product._id));
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      Toast({ message: "Failed to update wishlist.", type: "error" });
    }
  };

  useEffect(() => {
    if (product?.sku) {
      setSelectedSKUs(product?.sku[0]);
    }
  }, []);

  return (
    <div className={style.productCard}>
      <Link
        to={`/product/${product?.category.toLowerCase()}/${product.name.toLowerCase()}`}
        state={{ id: product._id }}
      >
        <div
          className={
            grid === 2
              ? style.productImg2
              : grid === 3
              ? style.productImg3
              : grid === 4
              ? style.productImg4
              : style.productImg3
          }
        >
          <img
            src={product?.images?.[0]?.url || "/defaultImage.png"}
            alt={product?.name}
            className={style.images}
          />
        </div>
        <div className={style.productDetails}>
          <p className={style.productName}>{product?.name}</p>
          <div className={style.rating}>
            <RatingStar
              rating={product?.averageRating}
              start={0}
              stop={5}
              disabled
            />
          </div>
          <div className={style.discountContainer}>
            <div className={style.PriceContainer}>
              <p className="originalPrice">${product?.price}</p>
              <p className="price">
                ${selectedCombination?.Price || product?.sellingPrice}
              </p>
            </div>
            {product?.discount && (
              <strong className="discount">{product?.discount}% off</strong>
            )}
          </div>
        </div>
      </Link>

      <div className={style.wishlist} onClick={handleWishlistToggle}>
        {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
      </div>

      <AddToCartButton onclick={handleAddToCart} />
    </div>
  );
};

export default ProductCard;
