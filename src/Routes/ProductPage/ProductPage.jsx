import { useEffect, useState, useMemo } from "react";
import style from "../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Component/MainComponents/Header";
import ReviewComponent from "./ReviewComponent";
import RelatedProduct from "./RelatedProduct";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import { Toast } from "../../Utils/Toast";
import { AddtoCart, getProductById } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import {
  FaFacebookF,
  FaHeart,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import Tabs from "../../Component/UI-Components/Tabs";
import Chip from "../../Component/Buttons/Chip";
import Loading from "../../Component/UI-Components/Loading";

const OptionSelector = ({
  options,
  selected,
  onSelect,
  label,
  isCompatible,
  suffix = "",
}) => (
  <div className={style.storageContainer}>
    <h6>
      {label}:{" "}
      {options.map((option, idx) => (
        <button
          key={idx}
          className={`${style.storage} ${
            selected === option ? style.selected : ""
          }`}
          onClick={() => onSelect(option)}
          disabled={isCompatible ? !isCompatible(option) : false}
          aria-label={`Select ${option} ${label}`}
        >
          {option} {suffix}
        </button>
      ))}
    </h6>
  </div>
);

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const id = location.state?.id;
  const { user } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.product);
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
  const isLiked = useSelector((state) => state.wishlist?.likedMap?.[id]);

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

  const currentIndex = products?.data?.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex < products?.data?.length - 1) {
      const nextProduct = products.data[currentIndex + 1];
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products.data[currentIndex - 1];
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const handleOptionSelect = (attribute, value) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev, [attribute]: value };
      Object.keys(newOptions).forEach((key) => {
        if (key !== attribute && !isOptionCompatible(key, newOptions[key])) {
          const validCombo = selectedSKUs.combinations.find(
            (c) => c[attribute] === value
          );
          if (validCombo) newOptions[key] = validCombo[key];
        }
      });
      return newOptions;
    });
  };

  const isOptionCompatible = (attribute, value) => {
    if (!selectedSKUs?.combinations) return true;
    return selectedSKUs.combinations.some((combo) =>
      Object.entries(selectedOptions).every(
        ([key, val]) =>
          key === attribute || combo[key] === val || combo[attribute] === value
      )
    );
  };

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

  const tabData = useMemo(() => {
    const tabs = [
      {
        label: "Product Detail",
        content: <div>{product?.description}</div>,
      },
      {
        label: "Reviews",
        content: (
          <ReviewComponent
            reviews={reviews}
            setReviews={setReviews}
            product={product}
            rating={rating}
            review={review}
            id={id}
            setReview={setReview}
            setRating={setRating}
          />
        ),
      },
    ];

    if (product?.sku?.length > 1 && product.specifications) {
      tabs.unshift({
        label: "Specifications",
        content: (
          <div>
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        ),
      });
    }

    return tabs;
  }, [product, reviews, rating, review, id]);

  const thumbnailImages =
    selectedSKUs?.SKUImages?.length > 1
      ? selectedSKUs.SKUImages.slice(0, 4)
      : product?.images?.slice(0, 4);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <Link to="/">Home</Link> / <Link to="">{product.category}</Link> /{" "}
            {product.name}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
              aria-label="Previous product"
            >
              <img src="/nextArrow.png" alt="" className={style.navIconPrev} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products?.data?.length - 1}
              className={style.navButton}
              aria-label="Next product"
            >
              <img src="/nextArrow.png" alt="" className={style.navIconNext} />
            </button>
          </div>
        </div>

        <div className={style.productLayout}>
          <div className={style.imageContainer}>
            <div className={style.productImageContainer}>
              <img
                src={selectedImage || defaultImage}
                alt={product.name}
                className={style.productImage}
              />
            </div>
            <div className={style.thumbnailsContainer}>
              {thumbnailImages?.map((img, idx) => {
                const url =
                  typeof img === "string" ? img : img?.url || defaultImage;
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`Thumbnail ${idx + 1}`}
                    className={style.thumbnail}
                    onClick={() => setSelectedImage(url)}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedImage(url)
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className={style.productDetails}>
            <div>
              <h1>{product.name.toUpperCase()}</h1>
              <div className={style.wishlist}>
                {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
              </div>
            </div>
            <div className={style.priceContainer}>
              <p className="originalPrice">${product?.price}</p>
              <p className="price">
                $
                {selectedCombination?.Price ??
                  product?.sellingPrice ??
                  product?.price}
              </p>
            </div>

            {/* Display unavailability message */}
            {!selectedCombination &&
              Object.keys(selectedOptions).length > 0 && (
                <p className={style.unavailableMessage}>Unavailable</p>
              )}

            {product.category && (
              <p>
                Category: <span>{product.category}</span>
              </p>
            )}
            {product.brand && (
              <p>
                Brand: <span>{product.brand}</span>
              </p>
            )}

            {selectedCombination && (
              <p className={style.selectedCombination}>
                Selected Configuration:{" "}
                {Object.entries(selectedOptions)
                  .map(([key, value]) => `${value} ${key}`)
                  .join(", ")}
              </p>
            )}

            <div className={style.quantity}>
              <button
                className={style.quantityButton}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className={style.quantityInput}
                min="1"
                aria-label="Quantity"
              />
              <button
                className={style.quantityButton}
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
              <div className={style.addToCartContainer}>
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  size="sm"
                  disabled={isAddingToCart || !selectedCombination}
                >
                  {isAddingToCart ? "Adding..." : "ADD TO CART"}
                </Button>
              </div>
            </div>

            {product.sku?.length > 1 && (
              <>
                <div className={style.colorContainer}>
                  <h6>Color:</h6>
                  {product.sku.map((item, i) => {
                    const firstImg =
                      item.details?.SKUImages?.[0] || defaultImage;
                    return (
                      <img
                        key={i}
                        src={firstImg}
                        className={style.thumbnail}
                        onClick={() => {
                          setSelectedImage(firstImg);
                          setSelectedSKUs(item.details || []);
                          if (item.details?.combinations?.length > 0) {
                            const firstCombination =
                              item.details.combinations[0];
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
                        }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setSelectedImage(firstImg);
                            setSelectedSKUs(item.details || []);
                            if (item.details?.combinations?.length > 0) {
                              const firstCombination =
                                item.details.combinations[0];
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
                          }
                        }}
                        alt={`Color option ${i + 1}`}
                      />
                    );
                  })}
                </div>
                {selectedSKUs?.combinations?.length > 0 &&
                  Object.entries(availableOptions).map(
                    ([attribute, options]) => (
                      <OptionSelector
                        key={attribute}
                        options={options}
                        selected={selectedOptions[attribute]}
                        onSelect={(value) =>
                          handleOptionSelect(attribute, value)
                        }
                        label={attribute}
                        isCompatible={(value) =>
                          isOptionCompatible(attribute, value)
                        }
                        suffix={
                          attribute.toLowerCase().includes("size") ||
                          attribute.toLowerCase().includes("weight")
                            ? attribute.toLowerCase().includes("weight")
                              ? options[0]?.toLowerCase().includes("kg")
                                ? ""
                                : "g"
                              : ""
                            : ""
                        }
                      />
                    )
                  )}
              </>
            )}

            {product.tags?.length > 0 && (
              <div className={style.Chip}>
                <h6>Tags:</h6>
                {product.tags.map((tag) => (
                  <Chip key={tag} name={tag} />
                ))}
              </div>
            )}

            <div className={style.share}>
              Share:
              <div className={style.shareIcons}>
                <FaFacebookF size={16} aria-label="Share on Facebook" />
                <FaTwitter size={16} aria-label="Share on Twitter" />
                <BiLogoInstagramAlt size={16} aria-label="Share on Instagram" />
                <FaLinkedinIn size={16} aria-label="Share on LinkedIn" />
              </div>
            </div>
          </div>
        </div>

        <Tabs tabs={tabData} />
      </div>
      <RelatedProduct />
      <Footer />
    </div>
  );
};

export default ProductPage;
