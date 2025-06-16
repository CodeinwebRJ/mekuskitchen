import styles from "../../styles/Review.module.css";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ product, index }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.rating}>
          <FaStar className={styles.starIcon} /> {product.rating}/5
        </div>
        <div className={styles.reviewNumber}>{index + 1}/5</div>
      </div>

      <p className={styles.text}>
        {product.comment}
      </p>

      {/* <div className={styles.profile}>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="reviewer"
          className={styles.avatar}
        />
        <div className={styles.details}>
          <div className={styles.name}>Mehul Patel</div>
          <div className={styles.title}>CEO, company</div>
        </div>
      </div> */}
    </div>
  );
};

export default ReviewCard;
