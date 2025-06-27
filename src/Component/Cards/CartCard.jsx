import style from "../../styles/CartCard.module.css";

const CartCard = ({
  itemCount,
  subtotal,
  discount,
  total, 
  couponCode,
  handleClick,
}) => (
  <div className={style.cartTotals}>
    <h3>Cart Summary</h3>
    <hr />
    <div>
      <p>
        Subtotal: <span>${subtotal} CAD</span>
      </p>
      <p>
        Total Items: <span>{itemCount}</span>
      </p>

      {discount > 0 && (
        <p>
          Coupon Applied: <strong>{couponCode}</strong>
        </p>
      )}

      {discount > 0 && (
        <p>
          Discount: <span className={style.discount}>-${discount} CAD </span>
        </p>
      )}
    </div>
    <hr />
    <div>
      <p className={style.total}>
        Grand Total: <span className={style.price}>${total} CAD</span>
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
