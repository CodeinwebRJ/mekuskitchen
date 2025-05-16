import { useEffect, useState } from "react";
import style from "../../styles/ReviewComponent.module.css";
import RatingStar from "../../Component/RatingStar";
import {
  addProductReview,
  getAllProductReview,
} from "../../axiosConfig/AxiosConfig";
import Button from "../../Component/Buttons/Button";
import { useSelector } from "react-redux";
import NoData from "../../Component/UI-Components/NoData";

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
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await getAllProductReview(id);
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const { user } = useSelector((state) => state.auth);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !review.trim()) return;

    try {
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
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Review"}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className={style.reviewForm}>
          <h3 className={style.formTitle}>
            Write a Review for{" "}
            <span className={style.productName}>"{product.name}"</span>
          </h3>

          <form onSubmit={handleSubmitReview} className={style.form}>
            <div className={style.formGroup}>
              <label htmlFor="rating" className={style.label}>
                Your Rating <span className={style.required}>*</span>
              </label>
              <RatingStar rating={rating} onChange={setRating} maxRating={5} />
            </div>

            <div className={style.formGroup}>
              <label htmlFor="review" className={style.label}>
                Your Review <span className={style.required}>*</span>
              </label>
              <input
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this product..."
                required
                className={style.textarea}
              />
            </div>

            <div className={`${style.formGroup} ${style.submitContainer}`}>
              <Button
                className={style.submitButton}
                variant="success"
                type="submit"
                size="sm"
              >
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
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
