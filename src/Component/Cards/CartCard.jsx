import style from "../../styles/CartCard.module.css";

const CartCard = ({
  item,
  handleClick,
  subtotal,
  total,
  discount,
  discountPercentage,
}) => (
  <div className={style.cartTotals}>
    <h3>Cart Summary</h3>
    <hr/>
    <div>
      <p>
        Subtotal: <span>${subtotal.toFixed(2)} CAD</span>
      </p>
      <p>
        Total Items: <span>{item} CAD</span>
      </p>
      <p>
        Total: <span>${total.toFixed(2)} CAD</span>
      </p>
      {discount > 0 && (
        <p>
          Discount:{" "}
          <span className={style.discount}>
            -${discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
          </span>
        </p>
      )}
    </div>
    <hr />
    <div>
      <p className={style.total}>
        Total: <span className={style.price}>${subtotal.toFixed(2)}</span>
      </p>
      <div className={style.checkoutButton}>
        <button className="Button" onClick={handleClick}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
);

export default CartCard;
