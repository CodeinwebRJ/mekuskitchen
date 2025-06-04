import React, { useState } from "react";
import style from "../../../styles/Addresses.module.css";
import MyAccountContainer from "../MyAccountContainer";
import AddressCard from "../../../Component/Cards/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import BillingShipping from "./BillingShipping";
import {
  ActiveUserAddress,
  DeleteUserAddress,
  getUserAddress,
} from "../../../axiosConfig/AxiosConfig";
import {
  deleteAddress,
  setAddresses,
  setDefaultAddress,
  setShowAddressForm,
} from "../../../../Store/Slice/AddressSlice";
import AddressForm from "./AddressForm";
import AddAddressCard from "../../../Component/UI-Components/AddAddressCard";

const Addresses = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { addresses, showAddressForm, defaultAddress } = useSelector(
    (state) => state.address
  );

  const fetchAddress = async () => {
    try {
      const response = await getUserAddress(user.userid);
      if (response.status === 200) {
        const data = response?.data?.data || [];
        dispatch(setAddresses(data));
        const activeAddress = data.find((addr) => addr.isActive);
        if (activeAddress) dispatch(setDefaultAddress(activeAddress));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleUpdateAddress = (addressId) => {
    setIsEdit(true);
    dispatch(setShowAddressForm(true));
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const data = {
        userId: user.userid,
        addressId: addressId,
      };
      await DeleteUserAddress(data);
      dispatch(deleteAddress(addressId));
      fetchAddress();
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleSetAsDefaultAddress = async (addressId) => {
    try {
      const data = {
        userId: user.userid,
        addressId: addressId,
      };
      const response = await ActiveUserAddress(data);
      if (response.status === 200) {
        fetchAddress();
      }
    } catch (error) {
      console.error("Error activating address:", error);
    }
  };

  return (
    <MyAccountContainer>
      {!showAddressForm ? (
        <>
          <div className={style.addressHeader}>
            <p className={style.userMessage}>
              The following addresses will be used on the checkout page by
              default.
            </p>
          </div>
          <BillingShipping />
          <div className={style.billingContainer}>
            <div className={style.billingAddressContainer}>
              {addresses.length < 3 ? (
                <AddAddressCard
                  onClick={() => {
                    dispatch(setShowAddressForm(true));
                    setIsEdit(false);
                  }}
                />
              ) : null}
              {addresses &&
                addresses.map((address, index) => (
                  <AddressCard
                    key={index}
                    address={address}
                    handleUpdateAddress={handleUpdateAddress}
                    handleDeleteAddress={handleDeleteAddress}
                    handleSetAsDefaultAddress={handleSetAsDefaultAddress}
                  />
                ))}
            </div>
          </div>
        </>
      ) : (
        <AddressForm
          isEdit={isEdit}
          onClose={() => {
            dispatch(setShowAddressForm(false));
          }}
          fetchAddress={fetchAddress}
        />
      )}
    </MyAccountContainer>
  );
};

export default Addresses;
