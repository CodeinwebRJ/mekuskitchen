import React, { useState, useEffect } from "react";
// import style from "../../../styles/Billing.module.css";
import style from "../../../styles/FormField.module.css";
import InputField from "../../../UI/InputField";
import SelectField from "../../../UI/SelectField";

const FormField = React.forwardRef(
  (
    {
      formData,
      handleChange,
      countries,
      states,
      validateForm,
      formErrors = {},
    },
    ref
  ) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Update local errors when formErrors prop changes
    useEffect(() => {
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);

        // Mark all fields with errors as touched
        const newTouched = { ...touched };
        Object.keys(formErrors).forEach((field) => {
          newTouched[field] = true;
        });
        setTouched(newTouched);
      }
    }, [formErrors]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      handleChange(name, value);

      // Clear error for this field when user starts typing
      if (errors[name]) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    };

    // Validate all fields on form submission
    const validateAllFields = () => {
      const allErrors = validateForm(formData);
      setErrors(allErrors);

      return Object.keys(allErrors).length === 0;
    };

    // Expose validateAllFields to parent component
    React.useImperativeHandle(ref, () => ({
      validateAllFields,
    }));

    return (
      <>
        <div className={style.billingFormColumn2}>
          <div className={style.inputFieldContainer}>
            <InputField
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              placeholder="First Name"
              label={true}
              labelName="First Name"
              required={true}
            />
            {errors.firstName && (
              <div className={style.errorMessage}>{errors.firstName}</div>
            )}
          </div>

          <div className={style.inputFieldContainer}>
            <InputField
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              placeholder="Last Name"
              label={true}
              labelName="Last Name"
              required={true}
            />
            {errors.lastName && (
              <div className={style.errorMessage}>{errors.lastName}</div>
            )}
          </div>
        </div>

        {/* Phone and Email */}
        <div className={style.billingFormColumn2}>
          <div className={style.inputFieldContainer}>
            <InputField
              type="number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="Phone"
              label={true}
              labelName="Phone"
              required={true}
            />
            {errors.phone && (
              <div className={style.errorMessage}>{errors.phone}</div>
            )}
          </div>

          <div className={style.inputFieldContainer}>
            <InputField
              type="text"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="Email"
              label={true}
              labelName="Email"
              required={true}
            />
            {errors.email && (
              <div className={style.errorMessage}>{errors.email}</div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className={style.billingFormColumn1}>
          <div className={style.inputFieldContainer}>
            <InputField
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="Address"
              label={true}
              labelName="Address"
              required={true}
            />
            {errors.address && (
              <div className={style.errorMessage}>{errors.address}</div>
            )}
          </div>
        </div>

        {/* Country / State */}
        <div className={style.billingFormColumn2}>
          <div className={style.inputFieldContainer}>
            <InputField
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              placeholder="Town / City"
              label={true}
              labelName="Town / City"
              required={true}
            />
            {errors.city && (
              <div className={style.errorMessage}>{errors.city}</div>
            )}
          </div>

          <div className={style.inputFieldContainer}>
            <SelectField
              label={true}
              labelName="Country / State"
              name="country"
              value={formData.country || ""}
              options={countries}
              placeholder="Select Country"
              onChange={handleInputChange}
              required={true}
            />
            {errors.country && (
              <div className={style.errorMessage}>{errors.country}</div>
            )}
          </div>
        </div>

        {/* City and Postcode */}
        <div className={style.billingFormColumn2}>
          <div className={style.inputFieldContainer}>
            <SelectField
              label={true}
              labelName="State / County"
              name="state"
              value={formData.state || ""}
              options={states}
              placeholder="Select State"
              onChange={handleInputChange}
              required={true}
            />
            {errors.state && (
              <div className={style.errorMessage}>{errors.state}</div>
            )}
          </div>

          <div className={style.inputFieldContainer}>
            <InputField
              type="number"
              name="postcode"
              value={formData.postcode || ""}
              onChange={handleInputChange}
              placeholder="Postcode / ZIP"
              label={true}
              labelName="Postcode / ZIP"
              required={true}
            />
            {errors.postcode && (
              <div className={style.errorMessage}>{errors.postcode}</div>
            )}
          </div>
        </div>
      </>
    );
  }
);

export default FormField;
