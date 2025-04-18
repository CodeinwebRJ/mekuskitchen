import React from "react";
import style from "../styles/AddressCard.module.css";

const AddressCard = ({ address }) => {
  return (
    <div
      className={`${style.addressCardContainer} ${
        address?.isActive ? style.addressCardContainerActive : ""
      }`}
    >
      <div className={style.addressCard}>
        <h1 className={style.fullName}>
          {address?.billing?.firstName} {address?.billing?.lastName}
        </h1>

        <p className={style.address}>{address?.address}</p>

        <p className={style.cityState}>
          {address?.billing?.city}, {address?.billing?.state}
        </p>

        <p className={style.CountryPostcode}>
          {address?.billing?.country} - {address?.billing?.postcode}
        </p>

        <p className={style.phoneNumber}>Phone: {address?.billing?.phone}</p>
      </div>

      {address?.isActive && <span className={style.defaultLabel}>Default</span>}
    </div>
  );
};

export default AddressCard;
