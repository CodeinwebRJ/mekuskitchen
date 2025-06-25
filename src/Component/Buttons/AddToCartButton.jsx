import style from "../../styles/AddToCartButton.module.css";
import { BsCartPlus } from "react-icons/bs";

const AddToCartButton = (props) => {
  const { onclick } = props;

  return (
    <button className={style.addToCart} onClick={onclick}>
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
