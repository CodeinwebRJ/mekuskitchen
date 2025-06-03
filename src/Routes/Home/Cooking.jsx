import styles from "../../styles/Cooking.module.css";
import rightThali from "../../../public/Dish.png";
import leftThali from "../../../public/Dish2.png";
import { Link } from "react-router-dom";

const Cooking = () => {
  return (
    <div className={styles.heroContainer}>
      <img
        src={leftThali}
        alt="Gujarati Thali Left"
        className={styles.leftImage}
      />
      <div className={styles.textContainer}>
        <h2>
          <span>
            <span className={styles.highlight}>Cravings</span>
            <span> or </span>
            <span className={styles.highlight}>Cooking</span> ?
          </span>
          <br />
          <strong>We’ve Got You Covered.</strong>
        </h2>
        <p>
          Too tired to cook? Order a comforting Gujarati meal. Feeling inspired?
          Get fresh groceries delivered fast. Whatever your mood — we bring the
          kitchen to you.
        </p>
        <Link to="/product-category">
          <button className={styles.orderButton}>
            Order Now <span className={styles.arrow}>→</span>
          </button>
        </Link>
      </div>
      <img
        src={rightThali}
        alt="Gujarati Thali Right"
        className={styles.rightImage}
      />
    </div>
  );
};

export default Cooking;
