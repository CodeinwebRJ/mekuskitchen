import React from "react";
import style from "../../../styles/Addresses.module.css";
import MyAccountContainer from "../MyAccountContainer";

const Addresses = () => {
  return (
    <MyAccountContainer>
      <div className={style.addressesContainer}>
        <p className={style.userMessage}>
          The following addresses will be used on the checkout page by default.
        </p>

        <div className={style.addressContainer}>
          {/* Billing Address */}
          <div className={style.billingAddressContainer}>
            <div className={style.addressTitle}>BILLING ADDRESS</div>
            <p className={style.addBillingText}>Add Billing address</p>
            <p className={style.addressNotFoundMessage}>
              You have not set up this type of address yet.
            </p>
          </div>

          {/* Shipping Address */}
          <div className={style.shippingAddressContainer}>
            <div className={style.addressTitle}>SHIPPING ADDRESS</div>
            <p className={style.addBillingText}>Add Shipping address</p>
            <p className={style.addressNotFoundMessage}>
              You have not set up this type of address yet.
            </p>
          </div>
        </div>
      </div>
    </MyAccountContainer>
  );
};

export default Addresses;
