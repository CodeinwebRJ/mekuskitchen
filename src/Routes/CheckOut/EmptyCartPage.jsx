import style from "../../styles/EmptyCartPage.module.css";
import { BsCartX } from "react-icons/bs";
import { Link } from "react-router-dom";

const EmptyCartPage = () => {

  return (
    <div className={style.emptyCartPage}>
      <h1 className={style.emptyCartIcon}>
        <BsCartX />
      </h1>

      <span className={style.emptyCartText}>Your cart is empty</span>

      <Link to="/product-category" className={style.emptyCartButton}>
        <button className="Button md">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
};

export default EmptyCartPage;
