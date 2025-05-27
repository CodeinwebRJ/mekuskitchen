import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getProductById,
  AddtoCart,
  AddtoWishlist,
  RemoveWishlist,
} from "../axiosConfig/AxiosConfig";
import { setCart } from "../../Store/Slice/UserCartSlice";
import { Toast } from "../Utils/Toast";
import { setWishlist, toggleLiked } from "../../Store/Slice/UserWishlistSlice";
import { setWishlistCount } from "../../Store/Slice/CountSlice";

const useProduct = (id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);

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

  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === product?._id);
      setIsLikedLocal(exists);
    }
  }, [product?._id, user]);

  const defaultImage = "/defaultImage.png";

  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    Toast({ message: defaultMessage, type: "error" });
  };

  const getDefaultImage = (product, sku) => {
    if (sku?.details?.SKUImages?.length > 0) {
      return sku.details.SKUImages[0];
    }
    if (product?.images?.length > 0) {
      return product.images[0].url;
    }
    return defaultImage;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        Toast({ message: "No product selected", type: "error" });
        navigate("/");
        return;
      }

      try {
        const res = await getProductById(id);
        const productData = res.data.data;
        setProduct(productData);
        const firstImage = getDefaultImage(productData);
        setSelectedImage(firstImage);

        if (productData?.sku?.length > 1) {
          const firstSKU = productData.sku[0] || [];
          setSelectedSKUs(firstSKU);
          if (firstSKU?.details?.combinations?.length > 0) {
            const firstCombination = firstSKU?.details?.combinations[0];
            const initialOptions = {};
            Object.keys(firstCombination).forEach((key) => {
              if (key !== "Price" && key !== "Stock") {
                initialOptions[key] = firstCombination[key];
              }
            });
            setSelectedOptions(initialOptions);
          } else {
            setSelectedOptions({});
          }
        } else {
          setSelectedSKUs(productData?.sku?.[0]?.details || []);
          setSelectedOptions({});
        }
      } catch (error) {
        handleApiError(error, "Failed to load product.");
        setProduct(null);
        setSelectedSKUs([]);
        setSelectedOptions({});
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedSKUs?.details?.SKUImages?.length > 0) {
      setSelectedImage(selectedSKUs.details.SKUImages[0]);
    } else if (product?.images?.length > 0) {
      setSelectedImage(product.images[0].url);
    } else {
      setSelectedImage(defaultImage);
    }
  }, [selectedSKUs, product]);

  const availableOptions = useMemo(() => {
    if (!selectedSKUs?.details?.combinations?.length) return {};
    const options = {};
    selectedSKUs?.details?.combinations.forEach((combo) => {
      Object.keys(combo).forEach((key) => {
        if (key !== "Price" && key !== "Stock") {
          if (!options[key]) options[key] = new Set();
          options[key].add(combo[key]);
        }
      });
    });
    return Object.fromEntries(
      Object.entries(options).map(([key, value]) => [key, [...value]])
    );
  }, [selectedSKUs]);

  const selectedCombination = useMemo(() => {
    if (!product || !selectedSKUs?.details?.combinations?.length) return null;
    return selectedSKUs?.details?.combinations.find((combo) =>
      Object.entries(selectedOptions).every(
        ([key, value]) => combo[key] === value
      )
    );
  }, [product, selectedSKUs, selectedOptions]);

  const handleAddToCart = async () => {
    if (!user.userid) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const exists = localCart.find((item) => item._id === product._id);

      if (exists) {
        const updatedCart = localCart.map((item) => {
          if (item._id === product._id) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({ message: "Product added to cart!", type: "success" });
        dispatch(setCart(updatedCart));
      } else {
        const price = selectedCombination?.Price || product.price;
        localCart.push({
          ...product,
          quantity,
          price,
          ...selectedOptions,
        });
        dispatch(setCart(localCart));
        localStorage.setItem("cart", JSON.stringify(localCart));
        Toast({ message: "Product added to cart!", type: "success" });
      }
      return;
    }

    if (Cart?.items?.tiffins?.length > 0) {
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
      const price = selectedCombination?.Price || product.price;

      const cartData = {
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity,
        price,
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
      handleApiError(error, "Failed to add product to cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isLikedFromStore = useSelector(
    (state) => state.wishlist?.likedMap?.[id]
  );

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
    setSelectedImage,
    setSelectedSKUs,
    setQuantity,
    setSelectedOptions,
    setReviews,
    setRating,
    setReview,
    handleAddToCart,
    handleWishlistToggle,
    isLikedLocal,
  };
};

export default useProduct;
