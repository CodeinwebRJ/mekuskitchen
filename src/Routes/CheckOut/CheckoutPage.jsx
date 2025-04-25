import React from "react";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import { Link } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useSelector } from "react-redux";
import Button from "../../Component/Buttons/Button";

const CheckoutPage = () => {
  const { defaultAddress } = useSelector((state) => state.address);

  return (
    <div>
      <Header />
      <Banner name="Checkout" />

      <div className={style.checkoutContianer}>
        <div className={style.addressDetailsContainer}>
          <div className={style.billingTitle}>
            <Link to="/cart">
              <GoArrowLeft size={24} className={style.backButton} />
            </Link>
            Billing Details
          </div>

          <div className={style.addressDetails}>
            <p className={style.fullname}>
              {defaultAddress?.billing?.firstName}{" "}
              {defaultAddress?.billing?.lastName}
            </p>
            <p>{defaultAddress?.billing?.address}</p>
            <p>{defaultAddress?.billing?.city}</p>
            <p>
              {defaultAddress?.billing?.state} -{" "}
              {defaultAddress?.billing?.postcode}
            </p>
            <p>{defaultAddress?.billing?.country}</p>
            <p>Phone - {defaultAddress?.billing?.phone}</p>
          </div>
        </div>

        <div className={style.orderSummaryContainer}>
          <div className={style.orderCard}>
            <h2 className={style.orderTitle}>Your Order</h2>
            <div className={style.orderRow}>
              <p>PRODUCT</p>
              <p>SUBTOTAL</p>
            </div>
            <div className={style.orderRow}>
              <p>Besan - 1KG x 1</p>
              <p>$3.20</p>
            </div>
            <div className={style.orderRow}>
              <p>Subtotal</p>
              <p>$3.20</p>
            </div>
            <div className={style.orderRow}>
              <p>Shipping</p>
              <p>Self Pickup</p>
            </div>
            <div className={style.orderRow}>
              <p>Tax</p>
              <p>$0.00</p>
            </div>
            <div className={`${style.orderRow} ${style.total}`}>
              <p>TOTAL</p>
              <p>$3.20</p>
            </div>
            <div className={style.paymentMethod}>
              <p>Debit Card</p>
              <p>You will be redirected to Moneris</p>
            </div>
            <div>
              <Button className={style.placeOrder}>Place Order</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
