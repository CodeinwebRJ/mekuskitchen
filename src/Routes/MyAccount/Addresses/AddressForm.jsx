import { useEffect, useState } from "react";
import style from "../../../styles/Addresses.module.css";
import FormField from "./FormField";
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
  const { isEdit, editData, fetchAddress, onClose } = props;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [formData, setFormData] = useState({
    billingData: {
      name: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postCode: "",
      phoneCode: "",
      provinceCode: "",
      countryCode: "",
      phone: "",
      email: "",
    },
    shippingData: {
      name: "",
      country: "",
      state: "",
      city: "",
      address: "",
      postCode: "",
      provinceCode: "",
      countryCode: "",
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
      name: "Name is required",
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
      updatedFields.countryCode = selectedCountry?.iso2;
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
        ? await UpdateUserAddress({
            addressId: editData._id,
            userId: user.userid,
            isDifferent: formData.isDifferent,
            billing: {
              name: formData.billingData.name,
              country: formData.billingData.country,
              state: formData.billingData.state,
              city: formData.billingData.city,
              address: formData.billingData.address,
              postCode: formData.billingData.postCode,
              phoneCode: formData.billingData.phoneCode,
              countryCode: formData.billingData.countryCode,
              provinceCode: formData.billingData.provinceCode,
              phone: formData.billingData.phone,
              email: formData.billingData.email,
            },
            ...(formData.isDifferent && {
              shipping: {
                name: formData.shippingData.name,
                country: formData.shippingData.country,
                state: formData.shippingData.state,
                city: formData.shippingData.city,
                phoneCode: formData.shippingData.phoneCode,
                address: formData.shippingData.address,
                postCode: formData.shippingData.postCode,
                countryCode: formData.shippingData.countryCode,
                provinceCode: formData.shippingData.provinceCode,
                phone: formData.shippingData.phone,
                email: formData.shippingData.email,
              },
            }),
          })
        : await addUserAddress({
            userId: user.userid,
            isDifferent: formData.isDifferent,
            billing: {
              name: formData.billingData.name,
              country: formData.billingData.country,
              state: formData.billingData.state,
              city: formData.billingData.city,
              address: formData.billingData.address,
              postCode: formData.billingData.postCode,
              phoneCode: formData.billingData.phoneCode,
              countryCode: formData.billingData.countryCode,
              provinceCode: formData.billingData.provinceCode,
              phone: formData.billingData.phone,
              email: formData.billingData.email,
            },
            ...(formData.isDifferent && {
              shipping: {
                name: formData.shippingData.name,
                country: formData.shippingData.country,
                state: formData.shippingData.state,
                city: formData.shippingData.city,
                phoneCode: formData.shippingData.phoneCode,
                address: formData.shippingData.address,
                postCode: formData.shippingData.postCode,
                countryCode: formData.shippingData.countryCode,
                provinceCode: formData.shippingData.provinceCode,
                phone: formData.shippingData.phone,
                email: formData.shippingData.email,
              },
            }),
          });
      if (res?.status === 200) {
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

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        billingData: {
          name: editData.billing?.name || "",
          country: editData.billing?.country || "",
          state: editData.billing?.state || "",
          city: editData.billing?.city || "",
          address: editData.billing?.address || "",
          postCode: editData.billing?.postCode || "",
          phoneCode: editData.billing?.phoneCode || "",
          provinceCode: editData.billing?.provinceCode || "",
          countryCode: editData.billing?.countryCode || "",
          phone: editData.billing?.phone || "",
          email: editData.billing?.email || "",
        },
        shippingData: editData.isDifferent
          ? {
              name: editData.shipping?.name || "",
              country: editData.shipping?.country || "",
              state: editData.shipping?.state || "",
              city: editData.shipping?.city || "",
              address: editData.shipping?.address || "",
              postCode: editData.shipping?.postCode || "",
              phoneCode: editData.shipping?.phoneCode || "",
              provinceCode: editData.shipping?.provinceCode || "",
              countryCode: editData.shipping?.countryCode || "",
              phone: editData.shipping?.phone || "",
              email: editData.shipping?.email || "",
            }
          : {
              name: "",
              country: "",
              state: "",
              city: "",
              address: "",
              postCode: "",
              phoneCode: "",
              provinceCode: "",
              countryCode: "",
              phone: "",
              email: "",
            },
        isDifferent: !!editData.isDifferent,
        isActive: editData.isActive !== undefined ? editData.isActive : true,
      });
    }
  }, [isEdit, editData]);


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
            <button className="Button sm" onClick={onClose}>
              Cancel
            </button>
          </div>
          <div className={style.submitButtonContainer}>
            <button className="Button sm">Save Address</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
