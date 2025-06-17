import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AddtoCart,
  AddtoWishlist,
  RemoveWishlist,
} from "../axiosConfig/AxiosConfig";
import { setCart } from "../../Store/Slice/UserCartSlice";
import { Toast } from "../Utils/Toast";
import { setWishlist, toggleLiked } from "../../Store/Slice/UserWishlistSlice";
import { setWishlistCount } from "../../Store/Slice/CountSlice";

const useProduct = (id) => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth) || {};
  const cart = useSelector((state) => state.cart) || {};
  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[id]
  );
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSKUs, setSelectedSKUs] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLikedLocal, setIsLikedLocal] = useState(false);

  const defaultImage = "/defaultImage.png";

  const getDefaultImage = (product, sku) => {
    return (
      sku?.details?.SKUImages?.[0] || product?.images?.[0]?.url || defaultImage
    );
  };

  useEffect(() => {
    if (!product) return;
    setSelectedImage(getDefaultImage(product, selectedSKUs));
  }, [product, selectedSKUs]);

  useEffect(() => {
    if (!isAuthenticated && product?._id) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setIsLikedLocal(localWishlist.some((item) => item._id === product._id));
    }
  }, [isAuthenticated, product?._id, isLikedFromStore, isLikedLocal]);

  const availableOptions = useMemo(() => {
    if (!selectedSKUs?.details?.combinations?.length) return {};
    const options = {};
    selectedSKUs.details.combinations.forEach((combo) => {
      Object.entries(combo).forEach(([key, value]) => {
        if (key !== "Price" && key !== "Stock") {
          options[key] = options[key] || new Set();
          options[key].add(value);
        }
      });
    });
    return Object.fromEntries(
      Object.entries(options).map(([key, value]) => [key, [...value]])
    );
  }, [selectedSKUs]);

  const selectedCombination = useMemo(() => {
    if (!selectedSKUs?.details?.combinations?.length) return null;
    return (
      selectedSKUs.details.combinations.find((combo) =>
        Object.entries(selectedOptions).every(
          ([key, value]) => combo[key] === value
        )
      ) || null
    );
  }, [selectedSKUs, selectedOptions]);

  const handleAddToCart = async () => {
    if (!product) {
      Toast({ message: "No product available", type: "error" });
      return;
    }

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
        Toast({ message: "Product added to cart!", type: "success" });
        dispatch(setCart(updatedCart));
      }

      return;
    }

    if (cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }

    if (product.sku.length > 1 && !selectedCombination) {
      Toast({
        message: "Selected configuration is unavailable",
        type: "error",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const cartData = {
        user_id: user?.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity,
        price: selectedCombination?.Price || product.price,
        ...(product.sku?.length > 1 && selectedSKUs?._id
          ? { skuId: selectedSKUs._id }
          : {}),
        ...(product.sku?.length > 1 && selectedCombination
          ? { combination: { ...selectedCombination } }
          : {}),
      };

      const res = await AddtoCart(cartData);
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Toast({ message: "Failed to add product to cart.", type: "error" });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) {
      Toast({ message: "No product available", type: "error" });
      return;
    }

    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === product._id);

      if (exists) {
        const updatedWishlist = localWishlist.filter(
          (item) => item._id !== product._id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsLikedLocal(false);
        dispatch(setWishlist(updatedWishlist));
        dispatch(setWishlistCount(updatedWishlist.length));
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        localWishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(localWishlist));
        setIsLikedLocal(true);
        dispatch(setWishlist(localWishlist));
        dispatch(setWishlistCount(localWishlist.length));
        Toast({ message: "Added to wishlist!", type: "success" });
      }
      return;
    }

    try {
      if (isLikedFromStore) {
        await RemoveWishlist({ userid: user?.userid, productId: product._id });
        Toast({ message: "Removed from wishlist!", type: "success" });
      } else {
        await AddtoWishlist({ userid: user?.userid, productId: product._id });
        Toast({ message: "Added to wishlist!", type: "success" });
      }
      dispatch(toggleLiked(product._id));
    } catch (error) {
      console.error("Wishlist operation failed:", error);
      Toast({ message: "Failed to update wishlist.", type: "error" });
    }
  };

  return {
    product,
    selectedImage,
    selectedSKUs,
    quantity,
    selectedOptions,
    reviews,
    rating,
    review,
    selectedCombination,
    availableOptions,
    isAddingToCart,
    isLiked: isAuthenticated ? isLikedFromStore : isLikedLocal,
    setSelectedImage,
    setSelectedSKUs,
    setQuantity,
    setSelectedOptions,
    setReviews,
    setRating,
    setReview,
    setProduct,
    handleAddToCart,
    handleWishlistToggle,
  };
};

export default useProduct;
