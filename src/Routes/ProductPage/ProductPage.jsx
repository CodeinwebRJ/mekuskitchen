import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../../styles/ProductPage.module.css";
import Header from "../../component/Header";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;

  const { products, loading } = useSelector((state) => state.food);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (products?.data?.length > 0) {
      const foundProduct = products.data.find((p) => p._id === id);
      setProduct(foundProduct);
    }
  }, [id, products]);

  const currentIndex = products?.data?.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < products.data.length - 1) {
      const nextProduct = products.data[currentIndex + 1];
      setProduct(nextProduct);
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products.data[currentIndex - 1];
      setProduct(prevProduct);
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.product_name} to cart`);
  };

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", {
      rating,
      review,
      product: product.product_name,
    });
    // Add your review submission logic here (e.g., API call)
    setRating(0);
    setReview("");
  };

  if (loading || !products?.data) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <a href="/">Home</a> / <a href="/food">Food</a> /{" "}
            {product.product_name}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
            >
              ⬅
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products.data.length - 1}
              className={style.navButton}
            >
              ➡
            </button>
          </div>
        </div>
        <div className={style.productLayout}>
          <div className={style.imageContainer}>
            <img
              src={product.image_url?.[0] || ""}
              alt={product.product_name}
              className={style.productImage}
            />
          </div>
          <div className={style.productDetails}>
            <h1>{product.product_name}</h1>
            <p className={style.price}>${product.price}</p>
            <div className={style.quantity}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={style.quantityButton}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className={style.quantityInput}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={style.quantityButton}
              >
                +
              </button>
              <button onClick={handleAddToCart} className={style.addToCart}>
                ADD TO CART
              </button>
            </div>
            <p className={style.category}>Category: {product.category}</p>
            <div className={style.share}>
              Share:
              <a href="#" className={style.shareIcon}>
                f
              </a>
              <a href="#" className={style.shareIcon}>
                t
              </a>
              <a href="#" className={style.shareIcon}>
                i
              </a>
              <a href="#" className={style.shareIcon}>
                p
              </a>
            </div>
          </div>
        </div>
        <div className={style.reviewsSection}>
          <h2>REVIEWS (0)</h2>
          <p>There are no reviews yet.</p>
          <div className={style.reviewForm}>
            <h3>BE THE FIRST TO REVIEW "{product.product_name}"</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className={style.rating}>
                <label>Your rating *: </label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={style.star}
                    onClick={() => handleRating(star)}
                    style={{ color: star <= rating ? "#ffd700" : "#ccc" }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={style.reviewInput}>
                <label>Your review *: </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review here..."
                />
              </div>
              <button type="submit" className={style.submitButton}>
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
