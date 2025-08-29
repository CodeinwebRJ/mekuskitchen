import style from "../../styles/CartCard.module.css";

const CartCard = ({
  itemCount,
  subtotal,
  discount,
  total,
  deliveryCharges,
  couponCode,
  handleClick,
  deliveryAvailable = true,
}) => {
  const numericSubtotal = Number(subtotal) || 0;
  const numericDiscount = Number(discount) || 0;
  const numericDeliveryCharges = Number(deliveryCharges) || 0;
  const numericTotal = Number(total) || 0;

  return (
    <div className={style.cartTotals}>
      <h3>Cart Summary</h3>
      <hr />
      <div>
        <p>
          Subtotal: <span>${numericSubtotal.toFixed(2)} CAD</span>
        </p>
        {/* <p>
          Delivery Charges:{" "}
          <span>${numericDeliveryCharges.toFixed(2)} CAD</span>
        </p> */}
        {numericDeliveryCharges > 0 && (
          <p>
            Delivery Charges:{" "}
            <span>${numericDeliveryCharges.toFixed(2)} CAD</span>
          </p>
        )}

        <p>
          Total Items: <span>{itemCount}</span>
        </p>
        {numericDiscount > 0 && (
          <p>
            Coupon Applied: <strong>{couponCode}</strong>
          </p>
        )}
        {numericDiscount > 0 && (
          <p>
            Discount:{" "}
            <span className={style.discount}>
              -${numericDiscount.toFixed(2)} CAD
            </span>
          </p>
        )}
      </div>
      <hr />
      <div>
        <p className={style.total}>
          Grand Total:{" "}
          <span className={style.price}>${numericTotal.toFixed(2)} CAD</span>
        </p>
        <div className={style.checkoutButton}>
          <button
            className="Button"
            onClick={handleClick}
            disabled={!deliveryAvailable} // ✅ disable if false
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
