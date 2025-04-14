import React, { useState } from "react";
import Header from "../../Component/Header";
import style from "../../styles/Cart.module.css";
import Banner from "../../Component/Banner";
import Footer from "../../Component/Footer";

const CheckOutCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Dosa",
      price: 10.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9zYXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 2,
      name: "Roti",
      price: 0.5,
      quantity: 1,
      image:
        "https://media.istockphoto.com/id/516359240/photo/bhendi-masala-or-bhindi-masala-ladies-finger-curry-with-chapati.jpg?s=612x612&w=0&k=20&c=0mGnvNM2lxl-dTTJlhAfVJE5WidxYmmvrvNs1NZUKvs=",
    },
  ]);

  const taxRate = 0.05; // 5% tax rate

  const updateQuantity = (id, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  // Calculate subtotal, tax, and total
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
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
              {cartItems.map((item) => (
                <tr key={item.id} className={style.cartItem}>
                  <td>
                    <button>x</button>
                  </td>
                  <td>
                    <div className={style.productCell}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={style.cartItemImage}
                      />
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className={style.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, -1)}>
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
