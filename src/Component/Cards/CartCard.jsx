import style from "../../styles/CartCard.module.css";

const CartCard = ({
  handleClick,
  subtotal,
  total,
  discount,
  discountPercentage,
}) => (
  <div className={style.cartTotals}>
    <h3>Cart Totals</h3>
    <p>
      Total: <span>${total.toFixed(2)}</span>
    </p>
    <p>
      Subtotal: <span>${subtotal.toFixed(2)}</span>
    </p>
    {discount > 0 && (
      <p>
        Discount:{" "}
        <span className={style.discount}>
          -${discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
        </span>
      </p>
    )}
    <hr />
    <p className={style.total}>
      Total: <span className={style.price}>${subtotal.toFixed(2)}</span>
    </p>
    <div className={style.checkoutButton}>
      <button className="Button" onClick={handleClick}>
        Proceed to Checkout
      </button>
    </div>
  </div>
);

export default CartCard;
