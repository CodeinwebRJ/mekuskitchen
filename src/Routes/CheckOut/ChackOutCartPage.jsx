// src/CheckOutCart.js
import React, { useState } from "react";
import style from "../../styles/Cart.module.css";
import Header from "../../Component/Header";
import Banner from "../../Component/Banner";
import Footer from "../../Component/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import Button from "../../UI/Button";
import { RxCross2 } from "react-icons/rx";
import EmptyCartPage from "./EmptyCartPage";

const CheckOutCart = () => {
  const dispatch = useDispatch();

  const User = useSelector((state) => state.auth.user);
  const Cart = useSelector((state) => state.cart);

  const taxRate = 0.05;

  const handleRemove = async (id) => {
    try {
      const data = {
        user_id: User?.userid,
        type: "product",
        product_id: id,
        quantity: 0,
      };
      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateQuantity = async (id, delta) => {
    try {
      console.log(Cart);
      console.log(id);
      const currentItem = Cart?.items?.items?.find((item) => item._id === id);
      if (!currentItem) return;

      const newQuantity = currentItem.quantity + delta;

      if (newQuantity < 1) return;

      const data = {
        user_id: User?.userid,
        type: "product",
        product_id: currentItem.product_id,
        quantity: newQuantity,
      };

      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const subtotal =
    Cart?.items?.items?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0;

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div>
      <Header />
      
      <Banner name={"CART"} />

      {Cart?.items?.items?.length > 0 ? (
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
                {Cart?.items?.items?.map((item) => (
                  <tr key={item.id} className={style.cartItem}>
                    <td>
                      <RxCross2
                        className={style.removeIcon}
                        onClick={() => handleRemove(item.product_id)}
                      />
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
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className={style.quantity}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className={style.totalPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
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
              Tax: <span className={style.taxAmount}>${tax.toFixed(2)}</span>
            </p>
            <hr />
            <p className={style.total}>
              Total:{" "}
              <span className={style.totalAmount}>${total.toFixed(2)}</span>
            </p>

            <div className={style.checkoutButton}>
              <Button variant="success" size="md">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <EmptyCartPage />
      )}
      <Footer />
    </div>
  );
};

export default CheckOutCart;
