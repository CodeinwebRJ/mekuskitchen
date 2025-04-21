import React from "react";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import { Link, useLocation } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { useSelector } from "react-redux";

const CheckoutPage = () => {
  const { defaultAddress } = useSelector((state) => state.address);

  console.log(defaultAddress);

  return (
    <div>
      <Header />
      <Banner name="Checkout" />

      <div className={style.checkoutContianer}>
        <div className={style.addressDetailsContainer}>
          <div className={style.billingTitle}>
            <Link to="/cart" onClick={() => {}}>
              <GoArrowLeft size={24} className={style.backButton} />
            </Link>
            Billing Details
          </div>

          <div className={style.addressDetails}>
            <p className={style.fullname}>
              {defaultAddress?.billing?.firstName}{" "}
              {defaultAddress?.billing?.lastName}
            </p>

            <p className={style.address}>{defaultAddress?.billing?.address}</p>

            <p className={style.city}>{defaultAddress?.billing?.city}</p>

            <p className={style.Country}>
              {defaultAddress?.billing?.state} -{" "}
              {defaultAddress?.billing?.postcode}
            </p>

            <p className={style.Country}>{defaultAddress?.billing?.country}</p>

            <p className={style.Country}>
              Phone - {defaultAddress?.billing?.phone}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
