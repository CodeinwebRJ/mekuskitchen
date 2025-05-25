import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductById, AddtoCart } from "../axiosConfig/AxiosConfig";
import { setCart } from "../../Store/Slice/UserCartSlice";
import { Toast } from "../Utils/Toast";

const useProduct = (id) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);

  const defaultImage = "/defaultImage.png";

  const handleApiError = (error, defaultMessage) => {
    console.error(error);
    Toast({ message: defaultMessage, type: "error" });
  };

  const getDefaultImage = (product) =>
    product?.images?.[0]?.url ||
    product?.sku?.[0]?.details?.SKUImages?.[0] ||
    defaultImage;

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
          const firstSKU = productData.sku[0]?.details || [];
          setSelectedSKUs(firstSKU);
          if (firstSKU?.combinations?.length > 0) {
            const firstCombination = firstSKU.combinations[0];
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
    if (
      selectedSKUs?.combinations?.length === 0 &&
      Object.keys(selectedOptions).length > 0
    ) {
      Toast({ message: "No valid configurations available", type: "error" });
    }
  }, [selectedSKUs, selectedOptions]);

  const availableOptions = useMemo(() => {
    if (!selectedSKUs?.combinations?.length) return {};
    const options = {};
    selectedSKUs.combinations.forEach((combo) => {
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
    if (!product || !selectedSKUs?.combinations?.length) return null;
    return selectedSKUs.combinations.find((combo) =>
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

    if (
      Object.keys(availableOptions).length > 0 &&
      Object.keys(selectedOptions).length !==
        Object.keys(availableOptions).length
    ) {
      Toast({
        message: "Please select all required options",
        type: "error",
      });
      return;
    }

    if (!selectedCombination) {
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
        ...selectedOptions,
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

  return {
    product,
    selectedImage,
    setSelectedImage,
    selectedSKUs,
    setSelectedSKUs,
    selectedOptions,
    setSelectedOptions,
    quantity,
    setQuantity,
    reviews,
    setReviews,
    rating,
    setRating,
    review,
    setReview,
    selectedCombination,
    availableOptions,
    handleAddToCart,
    isAddingToCart,
  };
};

export default useProduct;