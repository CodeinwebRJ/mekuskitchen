import React, { useState, useEffect } from "react";
import styles from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import { GoArrowLeft } from "react-icons/go";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../Component/Buttons/Button";
import FormField from "../MyAccount/Addresses/FormField";
import CheckboxField from "../../Component/UI-Components/CheckboxFeild";
import {
  addUserAddress,
  getUserCart,
  sendOrder,
} from "../../axiosConfig/AxiosConfig";
import { setShowAddressForm } from "../../../Store/Slice/AddressSlice";
import { setCart } from "../../../Store/Slice/UserCartSlice";

const BillingForm = ({
  formData,
  errors,
  handleChange,
  handleCheckboxChange,
  handleSubmitAddress,
  isLoading,
  apiError,
  countries,
  states,
}) => (
  <div className={styles.mainContainer}>
    <div className={styles.billingTitle}>
      <GoArrowLeft
        size={24}
        className={styles.backButton}
        onClick={() => setShowAddressForm(false)}
        aria-label="Go back"
      />
      Billing Address
    </div>
    <form className={styles.billingForm} onSubmit={handleSubmitAddress}>
      {apiError && <p className={styles.errorMessage}>{apiError}</p>}
      <FormField
        formData={formData.billingData}
        handleChange={(e) => handleChange(e, "billing")}
        countries={countries}
        states={states}
        formErrors={errors.billingErrors}
      />
      <div className={styles.checkboxContainer}>
        <CheckboxField
          checked={formData.isDifferent}
          onChange={handleCheckboxChange}
          id="different-shipping"
          label="Shipping address is different from billing address"
        />
      </div>
      {formData.isDifferent && (
        <div className={styles.billingContainer}>
          <div className={styles.billingTitle}>Shipping Address</div>
          <FormField
            formData={formData.shippingData}
            handleChange={(e) => handleChange(e, "shipping")}
            countries={countries}
            states={states}
            formErrors={errors.shippingErrors}
          />
        </div>
      )}
      <Button
        type="submit"
        className={styles.placeOrder}
        disabled={isLoading}
        variant="primary"
        size="md"
        aria-label="Submit address"
      >
        {isLoading ? "Processing..." : "Submit"}
      </Button>
    </form>
  </div>
);

const OrderSummary = ({ cart, isLoading, handleSubmit }) => (
  <div className={styles.orderSummaryContainer}>
    <div className={styles.orderCard}>
      <h2 className={styles.orderTitle}>Your Order</h2>
      <div className={styles.orderRow}>
        <p>PRODUCT</p>
        <p>SUBTOTAL</p>
      </div>
      {cart?.items?.products?.map((item, index) => (
        <div key={index} className={styles.orderRow}>
          <p>{`${item.name} x ${item.quantity}`}</p>
          <p>${item.subtotal.toFixed(2)}</p>
        </div>
      ))}
      <div className={styles.orderRow}>
        <p>Subtotal</p>
        <p>${cart?.items?.subtotal?.toFixed(2) || "0.00"}</p>
      </div>
      <div className={styles.orderRow}>
        <p>Shipping</p>
        <p>Self Pickup</p>
      </div>
      <div className={styles.orderRow}>
        <p>Tax</p>
        <p>${cart?.items?.taxAmount || "0.00"}</p>
      </div>
      <div className={`${styles.orderRow} ${styles.total}`}>
        <p>TOTAL</p>
        <p>${cart?.items?.totalAmount || "0.00"}</p>
      </div>
      <div className={styles.paymentMethod}>
        <p>Debit Card</p>
        <p>You will be redirected to Moneris</p>
      </div>
      <Button
        type="button"
        className={styles.placeOrder}
        disabled={isLoading}
        onClick={handleSubmit}
        variant="primary"
        size="md"
        aria-label="Place order"
      >
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  </div>
);

const AddressDisplay = ({ defaultAddress }) => (
  <div className={styles.addressDetails}>
    <p className={styles.fullname}>
      {defaultAddress?.billing?.firstName} {defaultAddress?.billing?.lastName}
    </p>
    <p>{defaultAddress?.billing?.address}</p>
    <p>{defaultAddress?.billing?.city}</p>
    <p>
      {defaultAddress?.billing?.state} {defaultAddress?.billing?.postcode}
    </p>
    <p>{defaultAddress?.billing?.country}</p>
    <p>Phone - {defaultAddress?.billing?.phone}</p>
  </div>
);

const CheckoutPage = () => {
  const { defaultAddress } = useSelector((state) => state.address);
  console.log(defaultAddress);
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

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

    // Real-time validation
    const fieldErrors = validateAddressForm({
      ...formData[dataKey],
      [name]: value,
    });
    setErrors((prev) => ({
      ...prev,
      [errorKey]: {
        ...prev[errorKey],
        [name]: fieldErrors[name] || "",
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

  const handleSubmitAddress = async (e) => {
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

    if (
      Object.keys(billingErrors).length > 0 ||
      Object.keys(shippingErrors).length > 0
    ) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await addUserAddress({
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiError("");
    try {
      const data = {
        userId: user.userid,
        cartId: cart.items._id,
        addressId: defaultAddress._id,
        paymentMethod: "COD",
        totalAmount: cart?.items?.totalAmount,
      };
      await sendOrder(data);
      const response = await getUserCart(user.userid);
      dispatch(setCart(response.data.data));
      alert("Order placed successfully!");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred while placing the order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const countries = [{ value: "United States", label: "United States" }];
  const states = [{ value: "California", label: "California" }];

  useEffect(() => {
    if (defaultAddress) {
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

  return (
    <div>
      <Header />
      <Banner name="Checkout" path="/cart" />
      <div className={styles.checkoutContainer}>
        {defaultAddress ? (
          <>
            <AddressDisplay defaultAddress={defaultAddress} />
            <OrderSummary
              cart={cart}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </>
        ) : (
          <BillingForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            handleSubmitAddress={handleSubmitAddress}
            isLoading={isLoading}
            apiError={apiError}
            countries={countries}
            states={states}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
