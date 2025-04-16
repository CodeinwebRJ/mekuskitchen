// src/CheckOutCart.js
import React, { useState } from "react";
import style from "../../styles/Cart.module.css";
import Header from "../../Component/Header";
import Banner from "../../Component/Banner";
import Footer from "../../Component/Footer";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../../Store/Slice/UserCartSlice";

const CheckOutCart = () => {
  const dispatch = useDispatch();

  const Cart = useSelector((state) => state.cart);
  const [cart, setCart] = useState(Cart);

  const taxRate = 0.05;

  const updateQuantity = (id, amount) => {
    dispatch(updateCartItemQuantity({ id, amount }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const subtotal =
    cart?.cart?.items?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0;

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div>
      <Header />
      <Banner name={"CART"} />
      <div className={style.cartContainer}>
        <div className={style.cartItems}>
          <table className={style.cartTable}>
            <thead>
              <tr className={style.cartItem}>
                <th />
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart?.cart?.items?.length > 0 ? (
                cart.cart.items.map((item) => (
                  <tr key={item.id} className={style.cartItem}>
                    <td>
                      <button onClick={() => handleRemove(item.id)}>x</button>
                    </td>
                    <td>
                      <div className={style.productCell}>
                        <img
                          src={item?.productDetails?.image_url[0]}
                          alt="product"
                          className={style.cartItemImage}
                        />
                        <span>{item?.productDetails?.product_name}</span>
                      </div>
                    </td>
                    <td>${item?.price}</td>
                    <td>
                      <div className={style.quantityControl}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1} // Optional: Disable if quantity is 1
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Your cart is empty</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={style.cartTotals}>
          <h3>Cart Totals</h3>
          <p>
            Subtotal: <span>${subtotal.toFixed(2)}</span>
          </p>
          <hr />
          <p>
            Shipping: <span>Self Pickup</span>
          </p>
          <hr />
          <p>
            Shipping to: <strong>Calgary, AB</strong>
          </p>
          <hr />
          <p>
            Tax: <span>${tax.toFixed(2)}</span>
          </p>
          <hr />
          <p className={style.total}>
            Total: <span>${total.toFixed(2)}</span>
          </p>
          <button className={style.checkoutButton}>Proceed to Checkout</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckOutCart;
