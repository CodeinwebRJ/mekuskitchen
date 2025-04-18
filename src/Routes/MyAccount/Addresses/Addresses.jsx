import React, { useState, useEffect } from "react";
import style from "../../../styles/Addresses.module.css";
import MyAccountContainer from "../MyAccountContainer";
import Button from "../../../UI/Button";
import AddressCard from "../../../UI/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import BillingShipping from "./BillingShipping";
import { getUserAddress } from "../../../axiosConfig/AxiosConfig";
import {
  setAddresses,
  setDefaultAddress,
  setShowAddressForm,
} from "../../../../Store/Slice/AddressSlice";
import AddressForm from "./AddressForm";

const Addresses = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { addresses, showAddressForm } = useSelector((state) => state.address);

  const handleEdit = () => {
    setIsEdit(true);
    dispatch(setShowAddressForm(true));
  };

  const fetchAddresses = async () => {
    try {
      const response = await getUserAddress(user.userid);
      if (response.status === 200) {
        const data = response?.data?.data || [];
        dispatch(setAddresses(data));
        const activeAddress = data.find((addr) => addr.isActive);
        if (activeAddress) dispatch(setDefaultAddress(activeAddress));
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <MyAccountContainer>
      {!showAddressForm ? (
        <>
          <div className={style.addressHeader}>
            <p className={style.userMessage}>
              The following addresses will be used on the checkout page by
              default.
            </p>

            <div className={style.addressHeaderButtons}>
              <div className={style.addNewAddressButton}>
                <Button
                  text="Edit Address"
                  variant="warning"
                  size="sm"
                  onClick={handleEdit}
                >
                  Edit Address
                </Button>
              </div>
              <div className={style.addNewAddressButton}>
                <Button
                  text="Add New Address"
                  variant="success"
                  size="sm"
                  onClick={() => {
                    dispatch(setShowAddressForm(true));
                  }}
                >
                  Add New Address
                </Button>
              </div>
            </div>
          </div>

          <BillingShipping />

          <div className={style.billingContainer}>
            <div className={style.billingAddressContainer}>
              {addresses &&
                addresses.map((address, index) => (
                  <AddressCard key={index} address={address} />
                ))}
            </div>
          </div>
        </>
      ) : (
        <AddressForm isEdit={isEdit} />
      )}
    </MyAccountContainer>
  );
};

export default Addresses;
