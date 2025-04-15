import React, { useEffect, useState } from "react";
import style from "../../../styles/ProductPage.module.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../Component/Footer";
import TiffinReviewComponent from "./TiffinReviewComponent";
import TiffinRelatedProduct from "./TiffinRelatedProduct";
import Header from "../../../component/Header";
import Button from "../../../UI/Button";

const TiffinProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const tiffin = useSelector((state) => state.tiffin);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const products = tiffin.tiffins || [];
  const loading = tiffin.loading;

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image_url?.[0] || null);
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

  return (
    <div>
      <Header />

      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <a href="/">Home</a> / <a href="/food">Tiffin</a> / {product.day}
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
                  selectedImage || product.image_url?.[0] || "/placeholder.png"
                }
                alt={product.day}
                className={style.productImage}
              />
            </div>
            <div className={style.thumbnailsContainer}>
              {/* {product.image_url?.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.product_name} thumbnail ${index + 1}`}
                  className={style.thumbnail}
                  onClick={() => setSelectedImage(image)}
                />
              ))} */}
            </div>
          </div>
          <div className={style.productDetails}>
            <h1>{product.day}</h1>
            <p className={style.price}>${product?.subTotal}</p>
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
                <Button variant="warning">ADD TO CART</Button>
              </div>
            </div>
            <p className={style.categoryContaine}>
              Category:{" "}
              <span className={style.category}>{product?.category}</span>
            </p>
            <div className={style.share}>
              Share:
              <a
                href="#"
                className={style.shareIcon}
                aria-label="Share on Facebook"
              >
                f
              </a>
              <a
                href="#"
                className={style.shareIcon}
                aria-label="Share on Twitter"
              >
                t
              </a>
              <a
                href="#"
                className={style.shareIcon}
                aria-label="Share on Instagram"
              >
                i
              </a>
              <a
                href="#"
                className={style.shareIcon}
                aria-label="Share on Pinterest"
              >
                p
              </a>
            </div>
          </div>
        </div>

        <TiffinReviewComponent
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

      <TiffinRelatedProduct />
      <Footer />
    </div>
  );
};

export default TiffinProductPage;
