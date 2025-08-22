import style from "../../../styles/FormField.module.css";
import InputField from "../../../Component/UI-Components/InputField";
import SelectField from "../../../Component/UI-Components/SelectField";
import { useSelector } from "react-redux";
import { CanadaSearch, googleAddress } from "../../../axiosConfig/AxiosConfig";
import { useEffect, useRef, useState } from "react";
import AddressAutocomplete from "../../../Component/Fields/Address";

const FormField = ({ formData, handleChange, formErrors = {} }) => {
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressDisplay, setAddressDisplay] = useState("");
  const { countriesData } = useSelector((state) => state.country);
  const suggestionRef = useRef(null);

  const countries = countriesData.map((country) => ({
    label: country.country,
    value: country.country,
    iso2: country.iso2,
    iso3: country.iso3,
  }));

  const selectedCountryData = countriesData.find(
    (country) => country.country === formData.country
  );

  const state =
    selectedCountryData?.states?.map((s) => ({
      label: s.state,
      value: s.state,
    })) || [];

  const selectedStateData = selectedCountryData?.states?.find(
    (s) => s.state === formData.state
  );

  const cities =
    selectedStateData?.cities?.map((city) => ({
      label: city,
      value: city,
    })) || [];

  const Phonecode = countriesData.map((country) => {
    const code = country?.PhoneCode?.startsWith("+")
      ? country?.PhoneCode
      : `+${country?.PhoneCode}`;

    return {
      label: code,
      value: code,
    };
  });

  useEffect(() => {
    if (formData.address && addressDisplay === "") {
      setAddressDisplay(formData.address);
    }
  }, [formData.address]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.address?.length < 3) {
        setAddressSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await CanadaSearch(formData.address);

        if (res.status === 200) {
          setAddressSuggestions(res.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [formData.address]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePlaceSelect = (place) => {
    const fullAddress = place.formatted_address || "";
    const streetOnly = fullAddress.split(",")[0]?.trim() || "";

    setAddressDisplay(fullAddress);

    handleChange({
      target: {
        name: "address",
        value: streetOnly,
      },
    });
  };

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
            options={state}
            disabled={!formData.country}
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
          <SelectField
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            disabled={!formData.state}
            options={cities}
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

      <div className={style.inputFieldContainer} ref={suggestionRef}>
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
        {/* {showSuggestions && addressSuggestions.length > 0 && (
          <ul className={style.suggestionList}>
            {addressSuggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => {
                  handleChange({
                    target: {
                      name: "address",
                      value: `${suggestion.Text}, ${suggestion.Description}`,
                    },
                  });
                  setShowSuggestions(false);
                }}
                className={style.suggestionItem}
              >
                {suggestion.Text}, {suggestion.Description}
              </li>
            ))}
          </ul>
        )} */}
      </div>

      {/* <CanadaPostAddressInput onAddressSelect={handleAddressSelect} /> */}

      {/* <div className={style.inputFieldContainer}>
        <label className={style.label}>Address</label>
        <AddressAutocomplete
          name="address"
          value={addressDisplay}
          onChange={(e) => {
            setAddressDisplay(e.target.value);
            handleChange({
              target: {
                name: "address",
                value: e.target.value.split(",")[0]?.trim(),
              },
            });
          }}
          onPlaceSelect={handlePlaceSelect}
        />
        {formErrors.address && (
          <div className={style.errorMessage}>{formErrors.address}</div>
        )}
      </div> */}

      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Name"
            labelName="Name"
            required
          />
          {formErrors.name && (
            <div className={style.errorMessage}>{formErrors.name}</div>
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

      <div className={style.billingFormColumn2}>
        <div className={style.inputFieldContainer}>
          <label className={style.label}>Phone</label>
          <div className={style.phoneInputWrapper}>
            <div>
              <SelectField
                name="phoneCode"
                value={formData.phoneCode || ""}
                onChange={(e) => handleChange(e, type)}
                options={Phonecode}
                placeholder="+1"
                className={style.phoneCodeSelect}
                required
              />
            </div>
            <InputField
              type="number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="Phone Number"
              className={style.phoneNumberInput}
              required
            />
          </div>
          {(formErrors.phoneCode || formErrors.phone) && (
            <div className={style.errorMessage}>
              {formErrors.phoneCode || formErrors.phone}
            </div>
          )}
        </div>

        <div className={style.inputFieldContainer}>
          <InputField
            type="text"
            name="provinceCode"
            value={formData.provinceCode || ""}
            onChange={handleChange}
            placeholder="Province Code"
            labelName="Province Code"
            required
          />
          {formErrors.provinceCode && (
            <div className={style.errorMessage}>{formErrors.provinceCode}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormField;
