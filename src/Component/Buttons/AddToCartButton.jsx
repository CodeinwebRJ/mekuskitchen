import style from "../../styles/AddToCartButton.module.css";
import { BsCartPlus } from "react-icons/bs";

const AddToCartButton = (props) => {
  const { onclick, disabled = false } = props;

  return (
    <button
      disabled={disabled}
      className={`${style.addToCart} ${disabled ? style.disabled : ""}`}
      onClick={onclick}
    >
      <span className={style.addToCartText}>
        <span className={style.addToCartIcon}>
          <BsCartPlus />
        </span>
        ADD TO CART
      </span>
    </button>
  );
};

export default AddToCartButton;
