import React, { useState, useRef, useEffect } from "react";
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
  setIsEditAddress,
} from "../../../../Store/Slice/AddressSlice";
import AddressForm from "./AddressForm";
import { setShowAddressForm } from "../../../../Store/Slice/AddressSlice";
import { useLocation } from "react-router-dom";
import EditAddressForm from "./EditAddressForm";
import { USER_ADDRESS_SCHEMA } from "../../../Utils/Schema";

const Addresses = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [formResponse, setFormResponse] = useState(USER_ADDRESS_SCHEMA);

  const { addresses, showAddressForm, isEditAddress, selectedAddress } =
    useSelector((state) => state.address);

  console.log(formResponse);

    
  // fetching user address
  const handleFetchAddress = async () => {
    try {
      const response = await getUserAddress("65123abcde456f7890123456");
      if (response.status === 200) {
        dispatch(setAddresses(response?.data?.data));

        activeAddressFetch(response?.data?.data);
      }
    } catch (error) {
      console.error("fetching address error", error);
    }
  };

  const activeAddressFetch = (address) => {
    const activeAddress = address.find((item) => item.isActive);
    if (activeAddress) {
      dispatch(setDefaultAddress(activeAddress));
    }
  };

  useEffect(() => {
    handleFetchAddress();
  }, []);

  // reset address form and edit address when pathname changes
  useEffect(() => {
    dispatch(setShowAddressForm(false));
    dispatch(setIsEditAddress(false));
  }, [pathname]);

  return (
    <MyAccountContainer>
      {!showAddressForm && (
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
                  size="xs"
                  onClick={() => {
                    dispatch(setShowAddressForm(true));
                  }}
                >
                  Edit Address
                </Button>
              </div>
              <div className={style.addNewAddressButton}>
                <Button
                  text="Add New Address"
                  variant="success"
                  size="xs"
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
      )}

      {showAddressForm && <AddressForm />}

      {isEditAddress && (
        <EditAddressForm
          formResponse={formResponse}
          setFormResponse={setFormResponse}
        />
      )}
    </MyAccountContainer>
  );
};

export default Addresses;
