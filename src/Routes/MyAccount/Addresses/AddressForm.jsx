import { useState } from "react";
import style from "../../../styles/Addresses.module.css";
import FormField from "./FormField";
import Button from "../../../Component/Buttons/Button";
import CheckboxFeild from "../../../Component/UI-Components/CheckboxFeild";
import { useDispatch, useSelector } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import { setShowAddressForm } from "../../../../Store/Slice/AddressSlice";
import {
  addUserAddress,
  UpdateUserAddress,
} from "../../../axiosConfig/AxiosConfig";
import { useLocation } from "react-router-dom";

const AddressForm = (props) => {
  const { isEdit, fetchAddress, onClose } = props;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
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
      phoneCode: "",
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
      phoneCode: "",
      phone: "",
      email: "",
    },
    isDifferent: false,
    isActive: true,
  });
  const [errors, setErrors] = useState({
    billingErrors: {},
    shippingErrors: {},
  });

  const { countriesData } = useSelector((state) => state.country);

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

    let updatedFields = {
      [name]: value,
    };

    if (name === "country") {
      const selectedCountry = countriesData.find(
        (country) => country.country === value
      );
      updatedFields.phoneCode = selectedCountry?.PhoneCode
        ? `+${selectedCountry.PhoneCode}`
        : "";
      updatedFields.state = "";
      updatedFields.city = "";
    }
    if (name === "state") {
      updatedFields.city = "";
    }

    setFormData((prev) => ({
      ...prev,
      [dataKey]: {
        ...prev[dataKey],
        ...updatedFields,
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

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isDifferent: !prev.isDifferent,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (res?.status === 201) {
        dispatch(setShowAddressForm(false));
        fetchAddress();
        {
          location.pathname === "/my-account/addresses" && onClose();
        }
      } else {
        console.error("Failed to submit address:", res);
      }
    } catch (error) {
      console.error("Error submitting address:", error);
    }
  };

  return (
    <div>
      {location.pathname === "/my-account/addresses" && (
        <div className={style.billingTitle}>
          <div onClick={() => dispatch(setShowAddressForm(false))}>
            <GoArrowLeft size={24} className={style.backButton} />
          </div>
          {isEdit ? "Edit Address" : "Billing Address"}
        </div>
      )}

      <form className={style.billingForm} onSubmit={handleSubmit}>
        <FormField
          formData={formData.billingData}
          handleChange={(e) => handleChange(e, "billing")}
          formErrors={errors.billingErrors}
        />

        <div className={`${style.billingFormColumn1} ${style.shippingAddress}`}>
          <div className={style.checkboxContainer}>
            <CheckboxFeild
              checked={formData.isDifferent}
              onChange={handleCheckboxChange}
              id="different-shipping"
            />
            <label htmlFor="different-shipping" className={style.checkboxLabel}>
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
                formErrors={errors.shippingErrors}
              />
            </div>
          </div>
        )}

        <div className={style.billingFormButtons}>
          <div className={style.submitButtonContainer}>
            <Button size="sm" variant="primary" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className={style.submitButtonContainer}>
            <Button type="submit" variant="primary" size="sm">
              Save Address
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
