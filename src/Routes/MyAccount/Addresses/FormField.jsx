import React from "react";
import style from "../../../styles/FormField.module.css";
import InputField from "../../../Component/UI-Components/InputField";
import SelectField from "../../../Component/UI-Components/SelectField";

const FormField = ({
  formData,
  handleChange,
  countries,
  states,
  formErrors = {},
}) => {
  return (
    <>
      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <SelectField
            labelName="Country"
            name="country"
            value={formData.country || ""}
            options={countries}
            placeholder="Select Country"
            onChange={handleChange}
            required
          />
          {formErrors.country && (
            <div className={style.errorMessage}>{formErrors.country}</div>
          )}
        </div>
        <div className={style.inputFieldContainer}>
          <SelectField
            labelName="State"
            name="state"
            value={formData.state || ""}
            options={states}
            placeholder="Select State"
            onChange={handleChange}
            required
          />
          {formErrors.state && (
            <div className={style.errorMessage}>{formErrors.state}</div>
          )}
        </div>
      </div>

      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="City"
            labelName="City"
            required
          />
          {formErrors.city && (
            <div className={style.errorMessage}>{formErrors.city}</div>
          )}
        </div>

        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="postCode"
            value={formData.postCode || ""}
            onChange={handleChange}
            placeholder="Postcode / ZIP"
            labelName="Postcode / ZIP"
            required
          />
          {formErrors.postCode && (
            <div className={style.errorMessage}>{formErrors.postCode}</div>
          )}
        </div>
      </div>

      <div className={style.billingFormColumn1}>
        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Address"
            labelName="Address"
            required
          />
          {formErrors.address && (
            <div className={style.errorMessage}>{formErrors.address}</div>
          )}
        </div>
      </div>

      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            placeholder="First Name"
            labelName="First Name"
            required
          />
          {formErrors.firstName && (
            <div className={style.errorMessage}>{formErrors.firstName}</div>
          )}
        </div>

        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            placeholder="Last Name"
            labelName="Last Name"
            required
          />
          {formErrors.lastName && (
            <div className={style.errorMessage}>{formErrors.lastName}</div>
          )}
        </div>
      </div>

      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <InputField
            type="number"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Phone"
            labelName="Phone"
            required
          />
          {formErrors.phone && (
            <div className={style.errorMessage}>{formErrors.phone}</div>
          )}
        </div>

        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            labelName="Email"
            required
          />
          {formErrors.email && (
            <div className={style.errorMessage}>{formErrors.email}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormField;
