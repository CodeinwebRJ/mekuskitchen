import React, { useEffect } from "react";
import style from "../../styles/ReviewComponent.module.css";
import RatingStar from "../../Component/RatingStar";
import {
  addProductReview,
  getAllProductReview,
} from "../../axiosConfig/AxiosConfig";
import Button from "../../UI/Button";

const ReviewComponent = ({
  reviews,
  setReviews,
  product,
  rating,
  review,
  setReview,
  id,
  setRating,
}) => {
  const fetchReviews = async () => {
    try {
      const res = await getAllProductReview(id);
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !review.trim()) return;

    try {
      const data = {
        user_id: "123435", // TODO: Replace with real user ID
        rating,
        comment: review,
        product_id: id,
      };
      await addProductReview(data);
      await fetchReviews();
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  return (
    <div className={style.reviewsSection}>
      <div className={style.sectionTitleContainer}>
        <h2 className={style.sectionTitle}>
          Customer Reviews ({reviews.length})
        </h2>
      </div>
      {reviews.length === 0 ? (
        <p className={style.noReviews}>
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className={style.reviewList}>
          {reviews.map((rev, index) => (
            <div key={index} className={style.reviewItem}>
              <div className={style.reviewHeader}>
                <span className={style.reviewUser}>User: {rev.user_id}</span>
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
              <p className={style.reviewComment}>{rev.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div className={style.reviewForm}>
        <h3 className={style.formTitle}>
          Write a Review for "{product.product_name}"
        </h3>

        <form onSubmit={handleSubmitReview}>
          <div className={style.rating}>
            <label className={style.formLabel}>
              Your Rating <span className={style.required}>*</span>
            </label>
            <RatingStar rating={rating} onChange={setRating} maxRating={5} />
          </div>

          <div className={style.reviewInput}>
            <label className={style.formLabel}>
              Your Review <span className={style.required}>*</span>
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              required
              className={style.textarea}
            />
          </div>

          <div className={style.submitButtonContainer}>
            <Button variant="success" type="submit">
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewComponent;
