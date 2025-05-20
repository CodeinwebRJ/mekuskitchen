import React, { useState, useEffect } from "react";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import { GoArrowLeft } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../Component/Buttons/Button";
import FormField from "../MyAccount/Addresses/FormField";
import CheckboxFeild from "../../Component/UI-Components/CheckboxFeild";
import {
  addUserAddress,
  UpdateUserAddress,
} from "../../axiosConfig/AxiosConfig";
import { setShowAddressForm } from "../../../Store/Slice/AddressSlice";

const CheckoutPage = () => {
  const { defaultAddress } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    billingErrors: {},
    shippingErrors: {},
  });

  const [formData, setFormData] = useState({
    userId: user.userid,
    billingData: {
      firstName: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postCode: "",
      phone: "",
      email: "",
    },
    shippingData: {
      firstName: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postCode: "",
      phone: "",
      email: "",
    },
    isDifferent: false,
    isActive: true,
  });

  const [isEdit, setIsEdit] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (defaultAddress) {
      setIsEdit(true);
      setFormData((prev) => ({
        ...prev,
        billingData: {
          firstName: defaultAddress.billing?.firstName || "",
          lastName: defaultAddress.billing?.lastName || "",
          country: defaultAddress.billing?.country || "",
          state: defaultAddress.billing?.state || "",
          city: defaultAddress.billing?.city || "",
          address: defaultAddress.billing?.address || "",
          postCode: defaultAddress.billing?.postcode || "",
          phone: defaultAddress.billing?.phone || "",
          email: defaultAddress.billing?.email || "",
        },
        shippingData: {
          firstName: defaultAddress.shipping?.firstName || "",
          lastName: defaultAddress.shipping?.lastName || "",
          country: defaultAddress.shipping?.country || "",
          state: defaultAddress.shipping?.state || "",
          city: defaultAddress.shipping?.city || "",
          address: defaultAddress.shipping?.address || "",
          postCode: defaultAddress.shipping?.postcode || "",
          phone: defaultAddress.shipping?.phone || "",
          email: defaultAddress.shipping?.email || "",
        },
        isDifferent: !!defaultAddress.shipping,
      }));
    }
  }, [defaultAddress]);

  const validateAddressForm = (data) => {
    const validationErrors = {};
    const requiredFields = {
      firstName: "First Name is required",
      lastName: "Last Name is required",
      country: "Country is required",
      state: "State is required",
      city: "City is required",
      address: "Address is required",
      postCode: "Postcode / ZIP is required",
      phone: "Phone is required",
      email: "Email is required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!data[field]?.trim()) {
        validationErrors[field] = message;
      }
    }

    if (data.postCode && !/^\d{5,6}$/.test(data.postCode)) {
      validationErrors.postCode = "Please enter a valid 5-6 digit pincode";
    }

    if (data.phone && !/^\d{10}$/.test(data.phone)) {
      validationErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (
      data.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)
    ) {
      validationErrors.email = "Invalid email address";
    }

    return validationErrors;
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    const dataKey = type === "billing" ? "billingData" : "shippingData";
    const errorKey = type === "billing" ? "billingErrors" : "shippingErrors";

    setFormData((prev) => ({
      ...prev,
      [dataKey]: {
        ...prev[dataKey],
        [name]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [errorKey]: {
        ...prev[errorKey],
        [name]: "",
      },
    }));
    setApiError("");
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isDifferent: !prev.isDifferent,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setIsLoading(true);

    const billingErrors = validateAddressForm(formData.billingData);
    const shippingErrors = formData.isDifferent
      ? validateAddressForm(formData.shippingData)
      : {};
    const combinedErrors = {
      billingErrors,
      shippingErrors,
    };
    setErrors(combinedErrors);

    const hasBillingErrors = Object.keys(billingErrors).length > 0;
    const hasShippingErrors = Object.keys(shippingErrors).length > 0;

    if (hasBillingErrors || hasShippingErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const res = isEdit
        ? await UpdateUserAddress(formData)
        : await addUserAddress({
            userId: user.userid,
            isDifferent: formData.isDifferent,
            billing: {
              firstName: formData.billingData.firstName,
              lastName: formData.billingData.lastName,
              country: formData.billingData.country,
              state: formData.billingData.state,
              city: formData.billingData.city,
              address: formData.billingData.address,
              postcode: formData.billingData.postCode,
              phone: formData.billingData.phone,
              email: formData.billingData.email,
            },
            ...(formData.isDifferent && {
              shipping: {
                firstName: formData.shippingData.firstName,
                lastName: formData.shippingData.lastName,
                country: formData.shippingData.country,
                state: formData.shippingData.state,
                city: formData.shippingData.city,
                address: formData.shippingData.address,
                postcode: formData.shippingData.postCode,
                phone: formData.shippingData.phone,
                email: formData.shippingData.email,
              },
            }),
          });

      if (res?.status === 200 || res?.status === 201) {
        dispatch(setShowAddressForm(false));
        setFormData({
          userId: user.userid,
          billingData: {
            firstName: "",
            lastName: "",
            country: "",
            state: "",
            city: "",
            address: "",
            postCode: "",
            phone: "",
            email: "",
          },
          shippingData: {
            firstName: "",
            lastName: "",
            country: "",
            state: "",
            city: "",
            address: "",
            postCode: "",
            phone: "",
            email: "",
          },
          isDifferent: false,
          isActive: true,
        });
      } else {
        setApiError("Failed to submit address. Please try again.");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred while submitting the address."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [{ value: "United States", label: "United States" }];
  const states = [{ value: "California", label: "California" }];

  return (
    <div>
      <Header />
      <Banner name="Checkout" path="/cart" />

      <div className={style.checkoutContianer}>
        {defaultAddress ? (
          <div className={style.addressDetails}>
            <p className={style.fullname}>
              {defaultAddress?.billing?.firstName}{" "}
              {defaultAddress?.billing?.lastName}
            </p>
            <p>{defaultAddress?.billing?.address}</p>
            <p>{defaultAddress?.billing?.city}</p>
            <p>
              {defaultAddress?.billing?.state}
              {defaultAddress?.billing?.postcode}
            </p>
            <p>{defaultAddress?.billing?.country}</p>
            <p>Phone - {defaultAddress?.billing?.phone}</p>
          </div>
        ) : (
          <div>
            <div className={style.billingTitle}>
              <div onClick={() => dispatch(setShowAddressForm(false))}>
                <GoArrowLeft size={24} className={style.backButton} />
              </div>
              Billing Address
            </div>

            <form className={style.billingForm} onSubmit={handleSubmit}>
              {apiError && <p className={style.errorMessage}>{apiError}</p>}
              <FormField
                formData={formData.billingData}
                handleChange={(e) => handleChange(e, "billing")}
                countries={countries}
                states={states}
                formErrors={errors.billingErrors}
              />

              <div
                className={`${style.billingFormColumn1} ${style.shippingAddress}`}
              >
                <div className={style.checkboxContainer}>
                  <CheckboxFeild
                    checked={formData.isDifferent}
                    onChange={handleCheckboxChange}
                    id="different-shipping"
                  />
                  <label
                    htmlFor="different-shipping"
                    className={style.checkboxLabel}
                  >
                    Shipping address is different from billing address!
                  </label>
                </div>
              </div>

              {formData.isDifferent && (
                <div className={style.billingContainer}>
                  <div className={style.billingTitle}>Shipping Address</div>
                  <div className={style.billingForm}>
                    <FormField
                      formData={formData.shippingData}
                      handleChange={(e) => handleChange(e, "shipping")}
                      countries={countries}
                      states={states}
                      formErrors={errors.shippingErrors}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
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
              <Button
                type="submit"
                className={style.placeOrder}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
