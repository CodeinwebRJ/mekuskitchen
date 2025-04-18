import React, { useState } from "react";
import style from "../../../styles/Addresses.module.css";
import FormField from "./FormField";
import Button from "../../../UI/Button";
import CheckboxFeild from "../../../UI/CheckboxFeild";
import { useDispatch } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import { setShowAddressForm } from "../../../../Store/Slice/AddressSlice";
import {
  addUserAddress,
  UpdateUserAddress,
} from "../../../axiosConfig/AxiosConfig";

const AddressForm = ({ isEdit }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
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
    isDifferentShipping: false,
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
  });

  const [errors, setErrors] = useState({
    billingErrors: {},
    shippingErrors: {},
  });

  const countries = [{ value: "US", label: "United States" }];
  const states = [{ value: "CA", label: "California" }];

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const billingErrors = validateAddressForm(formData.billingData);
    const shippingErrors = formData.isDifferentShipping
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
      return;
    }

    try {
      const res = isEdit
        ? await UpdateUserAddress(formData)
        : await addUserAddress(formData);
      if (res?.data?.success) {
        console.log(res.data.data);
        dispatch(setShowAddressForm(false));
      } else {
        console.error("Failed to submit address:", res);
      }
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  return (
    <div>
      <div className={style.billingTitle}>
        <div onClick={() => dispatch(setShowAddressForm(false))}>
          <GoArrowLeft size={24} />
        </div>
        {isEdit ? "Edit Address" : "Billing Address"}
      </div>

      <form className={style.billingForm} onSubmit={handleSubmit}>
        <FormField
          formData={formData.billingData}
          handleChange={(e) => handleChange(e, "billing")}
          countries={countries}
          states={states}
          formErrors={errors.billingErrors}
        />

        <div className={`${style.billingFormColumn1} ${style.shippingAddress}`}>
          <div className={style.checkboxContainer}>
            <CheckboxFeild
              checked={formData.isDifferentShipping}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  isDifferentShipping: !prev.isDifferentShipping,
                }))
              }
              id="different-shipping"
            />
            <label htmlFor="different-shipping" className={style.checkboxLabel}>
              Shipping address is different from billing address!
            </label>
          </div>
        </div>

        {formData.isDifferentShipping && (
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

        <div className={style.billingFormButtons}>
          <div className={style.submitButtonContainer}>
            <Button
              variant="warning"
              size="sm"
              type="button"
              onClick={() => dispatch(setShowAddressForm(false))}
            >
              Cancel
            </Button>
          </div>
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

export default AddressForm;
