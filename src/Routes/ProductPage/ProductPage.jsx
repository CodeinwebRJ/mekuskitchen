import React, { useEffect, useState } from "react";
import style from "../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Component/MainComponents/Header";
import ReviewComponent from "./ReviewComponent";
import RelatedProduct from "./RelatedProduct";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import { Toast } from "../../Utils/Toast";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTwitter,
} from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);

  const productState = useSelector((state) => state.product);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const products = productState.products?.data || [];
  const loading = productState.loading;

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images?.[0].url || null);
      } else {
        setProduct(null);
      }
    }
  }, [id, products]);

  const currentIndex = products.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < products.length - 1) {
      const nextProduct = products[currentIndex + 1];
      setProduct(nextProduct);
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products[currentIndex - 1];
      setProduct(prevProduct);
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product || !Array.isArray(products) || products.length === 0) {
    return <p>Product not found</p>;
  }

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
        product_id: product._id,
        quantity: 1,
        price: product.price,
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

  console.log(product);

  return (
    <div>
      <Header />

      {/* Product Page Container */}
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <a href="/">Home</a> / <a href="/food">Food</a> / {product.name}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
              aria-label="Previous product"
            >
              <img
                src="/nextArrow.png"
                alt="Previous"
                className={style.navIconPrev}
              />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products.length - 1}
              className={style.navButton}
              aria-label="Next product"
            >
              <img
                src="/nextArrow.png"
                alt="Next"
                className={style.navIconNext}
              />
            </button>
          </div>
        </div>
        <div className={style.productLayout}>
          <div className={style.imageContainer}>
            <div className={style.productImageContainer}>
              <img
                src={
                  selectedImage || product.images?.[0].url || "/placeholder.png"
                }
                alt={product.name}
                className={style.productImage}
              />
            </div>
            <div className={style.thumbnailsContainer}>
              {product.images?.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={style.thumbnail}
                  onClick={() => setSelectedImage(image)}
                  onMouseEnter={() => setSelectedImage(image)}
                  onMouseLeave={() => setSelectedImage(product.image?.[0])}
                />
              ))}
            </div>
          </div>
          <div className={style.productDetails}>
            <h1>{product.name}</h1>
            <p className={`${style.productPrice} price`}>${product?.price}</p>
            <div className={style.quantity}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={style.quantityButton}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className={style.quantityInput}
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={style.quantityButton}
                aria-label="Increase quantity"
              >
                +
              </button>

              <div className={style.addToCartContainer}>
                <Button onClick={handleAddToCart} variant="warning" size="sm">
                  ADD TO CART
                </Button>
              </div>
            </div>
            <p className={style.categoryContaine}>
              Category:{" "}
              <span className={style.category}>{product.category}</span>
            </p>
            <div className={style.share}>
              Share:
              <div className={style.shareIcons}>
                <FaFacebookF className={style.shareIcon} />
                <FaTwitter className={style.shareIcon} />
                <BiLogoInstagramAlt className={style.shareIcon} />
                <FaPinterest className={style.shareIcon} />
                <FaLinkedinIn className={style.shareIcon} />
              </div>
            </div>
            <div>
              <h5>description</h5>
              <div>
                {product.description && <span>{product.description}</span>}
              </div>
            </div>
          </div>
        </div>
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
      </div>
      <RelatedProduct />
      <Footer />
    </div>
  );
};

export default ProductPage;
