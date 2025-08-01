import { useState } from "react";
import style from "../../styles/ReviewComponent.module.css";
import RatingStar from "../../Component/RatingStar";
import {
  addProductReview,
  addTiffinReview,
} from "../../axiosConfig/AxiosConfig";
import { useSelector } from "react-redux";
import NoData from "../../Component/UI-Components/NoData";
import InputField from "../../Component/UI-Components/InputField";
import { useLocation } from "react-router-dom";

const ReviewComponent = ({
  reviews,
  product,
  rating,
  review,
  setReview,
  id,
  setRating,
  fetchReviews,
}) => {
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({ rating: "", review: "" });
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const validateForm = () => {
    let validationErrors = { rating: "", review: "" };
    let isValid = true;

    if (!isAuthenticated) {
      validationErrors.review = "Please Login to submit a review.";
      isValid = false;
    }

    if (!rating) {
      validationErrors.rating =
        "Please select a rating before submitting a review!";
      isValid = false;
    }

    if (!review.trim()) {
      validationErrors.review = "This field cannot be empty.";
      isValid = false;
    } else if (review.trim().length < 10) {
      validationErrors.review =
        "Your review should contain a minimum of 10 characters.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const category = location.pathname.split("/").filter(Boolean);

  const isTiffin = category[1];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isTiffin === "tiffin") {
        const data = {
          user_id: user.userid,
          rating,
          comment: review,
          product_id: id,
        };
        await addTiffinReview(data);
      } else {
        const data = {
          user_id: user.userid,
          rating,
          comment: review,
          product_id: id,
        };
        await addProductReview(data);
        await fetchReviews();
        setRating(0);
        setReview("");
        setShowForm(false);
        setErrors({ rating: "", review: "" });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <div className={style.reviewsSection}>
      <div className={style.sectionTitleContainer}>
        <h2 className={style.sectionTitle}>
          Customer Reviews ({reviews.length})
        </h2>
        <div>
          <button
            className="Button sm"
            onClick={() => {
              if (showForm) {
                setRating(0);
                setReview("");
                setErrors({ rating: "", review: "" });
              }
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "Add Review"}
          </button>
        </div>
      </div>

      {showForm ? (
        <div className={style.reviewForm}>
          <h3 className={style.formTitle}>Write a Review</h3>
          <form onSubmit={handleSubmitReview} className={style.form}>
            <div className={style.formGroup}>
              <label htmlFor="rating" className={style.label}>
                Your Rating*
              </label>
              <RatingStar
                rating={rating}
                onChange={(value) => {
                  setRating(value);
                  if (errors.rating) {
                    setErrors((prev) => ({ ...prev, rating: "" }));
                  }
                }}
                maxRating={5}
              />
              {errors.rating && (
                <p className={style.errorMessage}>{errors.rating}</p>
              )}
            </div>

            <div className={style.formGroup}>
              <label htmlFor="review" className={style.label}>
                Your Review*
              </label>
              <InputField
                id="review"
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  if (errors.review) {
                    setErrors((prev) => ({ ...prev, review: "" }));
                  }
                }}
                placeholder="Share your experience with this product"
                className={style.textarea}
              />
              {errors.review && (
                <p className={style.errorMessage}>{errors.review}</p>
              )}
            </div>

            <div className={`${style.formGroup} ${style.submitContainer}`}>
              <button className="Button sm">Submit Review</button>
            </div>
          </form>
        </div>
      ) : reviews.length === 0 ? (
        <div className={style.noReviews}>
          <NoData />
        </div>
      ) : (
        <div className={style.reviewList}>
          {reviews.map((rev, index) => (
            <div key={index} className={style.reviewItem}>
              <div className={style.reviewHeader}>
                <div className={style.reviewAvatar}>
                  {rev.user_id?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className={style.reviewUser}>{rev.user_id}</div>
                  <div className={style.reviewRating}>
                    <RatingStar
                      rating={rev.rating}
                      start={0}
                      stop={5}
                      fractions={2}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <p className={style.reviewComment}>{rev.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;
