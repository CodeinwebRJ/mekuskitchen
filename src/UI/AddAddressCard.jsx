import React from "react";
import style from "../styles/AddAddressCard.module.css";
import { MdAdd } from "react-icons/md";

const AddAddressCard = ({ onClick }) => {
  return (
    <div className={style.addAddressCardContainer} onClick={onClick}>
      <MdAdd className={style.addAddressCardIcon} />
      <h1 className={style.addAddressCardTitle}>Add New Address</h1>
    </div>
  );
};

export default AddAddressCard;
