import React, { useRef, useState, useEffect } from "react";
import style from "../../../styles/Addresses.module.css";
import FormField from "./FormField";
import Button from "../../../UI/Button";
import CheckboxFeild from "../../../UI/CheckboxFeild";
import { useDispatch } from "react-redux";
import { setShowAddressForm } from "../../../../Store/Slice/AddressSlice";

const EditAddressForm = (props) => {
  const { formResponse, setFormResponse } = props;

  const [isDifferentShipping, setIsDifferentShipping] = useState(false);
  const [billingErrors, setBillingErrors] = useState({});
  const [shippingErrors, setShippingErrors] = useState({});

  // Refs to access the AddressForm methods
  const billingFormRef = useRef();
  const shippingFormRef = useRef();

  const dispatch = useDispatch();

  const countries = [
    { id: 1, value: "United States", label: "United States" },
    { id: 2, value: "Canada", label: "Canada" },
    { id: 3, value: "Mexico", label: "Mexico" },
    { id: 4, value: "United Kingdom", label: "United Kingdom" },
    { id: 5, value: "Australia", label: "Australia" },
    { id: 6, value: "New Zealand", label: "New Zealand" },
    { id: 7, value: "South Africa", label: "South Africa" },
    { id: 8, value: "India", label: "India" },
    { id: 9, value: "Brazil", label: "Brazil" },
  ];

  const states = [
    { id: 1, value: "California", label: "California" },
    { id: 2, value: "New York", label: "New York" },
    { id: 3, value: "Texas", label: "Texas" },
    { id: 4, value: "Florida", label: "Florida" },
    { id: 5, value: "Illinois", label: "Illinois" },
  ];

  // Initialize form data from schema
  const [billingData, setBillingData] = useState(formResponse[0].billing);
  const [shippingData, setShippingData] = useState(formResponse[0].shipping);

  // Update local state when formResponse changes
  useEffect(() => {
    setBillingData(formResponse[0].billing);
    setShippingData(formResponse[0].shipping);
  }, [formResponse]);

  // Handle billing address changes
  const handleBillingChange = (name, value) => {
    // Update local state
    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update formResponse
    setFormResponse((prevResponse) => {
      const updatedResponse = [...prevResponse];
      updatedResponse[0] = {
        ...updatedResponse[0],
        billing: {
          ...updatedResponse[0].billing,
          [name]: value,
        },
      };
      return updatedResponse;
    });
  };

  // Handle shipping address changes
  const handleShippingChange = (name, value) => {
    // Update local state
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update formResponse
    setFormResponse((prevResponse) => {
      const updatedResponse = [...prevResponse];
      updatedResponse[0] = {
        ...updatedResponse[0],
        shipping: {
          ...updatedResponse[0].shipping,
          [name]: value,
        },
      };
      return updatedResponse;
    });
  };

  // Validation function that can be reused for both forms
  const validateAddressForm = (formData) => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!formData.country) {
      errors.country = "Country is required";
    }
    if (!formData.state) {
      errors.state = "State is required";
    }
    if (!formData.city) {
      errors.city = "City is required";
    }
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.postcode) {
      errors.postcode = "Postcode / ZIP is required";
    } else if (!/^\d{6}$/.test(formData.postcode)) {
      errors.postcode = "Please enter a valid 6-digit pincode";
    }
    if (!formData.phone) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate billing form
    const billingValidationErrors = validateAddressForm(billingData);
    setBillingErrors(billingValidationErrors);
    const isBillingValid = Object.keys(billingValidationErrors).length === 0;

    // Validate shipping form if needed
    let isShippingValid = true;
    let shippingValidationErrors = {};
    if (isDifferentShipping) {
      shippingValidationErrors = validateAddressForm(shippingData);
      setShippingErrors(shippingValidationErrors);
      isShippingValid = Object.keys(shippingValidationErrors).length === 0;
    }

    // If both forms are valid, proceed with submission
    if (isBillingValid && isShippingValid) {
      console.log("Form submitted successfully:", formResponse[0]);
      // TODO: Add your API call here to save the addresses
    }
  };

  return (
    <div>
      <div className={style.billingTitle}>Billing Address</div>

      <form onSubmit={handleSubmit} className={style.billingForm}>
        <FormField
          ref={billingFormRef}
          formData={billingData}
          handleChange={handleBillingChange}
          countries={countries}
          states={states}
          validateForm={validateAddressForm}
          formErrors={billingErrors}
        />

        {/* Shipping address is different from billing address */}
        <div className={`${style.billingFormColumn1} ${style.shippingAddress}`}>
          <div className={style.checkboxContainer}>
            <CheckboxFeild
              checked={isDifferentShipping}
              onChange={() => setIsDifferentShipping(!isDifferentShipping)}
            />
            <label
              className={style.checkboxLabel}
              onClick={() => setIsDifferentShipping(!isDifferentShipping)}
            >
              Shipping address is different from billing address!
            </label>
          </div>
        </div>

        {isDifferentShipping && (
          <div className={style.billingContainer}>
            <div className={style.billingTitle}>Shipping Address</div>
            <div className={style.billingForm}>
              <FormField
                ref={shippingFormRef}
                formData={shippingData}
                handleChange={handleShippingChange}
                countries={countries}
                states={states}
                validateForm={validateAddressForm}
                formErrors={shippingErrors}
              />
            </div>
          </div>
        )}

        <div className={style.billingFormButtons}>
          {/* Cancel Button */}
          <div className={style.submitButtonContainer}>
            <Button
              variant="warning"
              size="sm"
              onClick={() => {
                dispatch(setShowAddressForm(false));
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Cancel
            </Button>
          </div>

          {/* Submit Button */}
          <div className={style.submitButtonContainer}>
            <Button type="submit" variant="success" size="sm">
              Save Address
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAddressForm;
