import style from "../../styles/PhoneNumber.module.css";

const PhoneNumber = ({
  phoneCode,
  phone,
  onChange,
  phoneCodeOptions = [
    { label: "+1", value: "+1" },
    { label: "+91", value: "+91" },
    { label: "+44", value: "+44" },
    { label: "+61", value: "+61" },
  ],
  error,
  name = "phone",
  codeName = "phoneCode",
  label = "Phone Number",
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      onChange(e);
    }
  };

  const preventScroll = (e) => {
    e.target.blur();
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    const invalidKeys = ["e", "E", "+", "-", ".", ","];

    if (invalidKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={style.container}>
      <label className={style.label} htmlFor={name}>
        {label}
      </label>

      <div className={style.phoneNumber}>
        <select
          name={codeName}
          value={phoneCode}
          onChange={onChange}
          className={style.codeSelect}
        >
          {phoneCodeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={style.divider}></div>

        <input
          type="number"
          name={name}
          value={phone}
          onChange={handleChange}
          className={style.phoneNumberInput}
          onWheel={preventScroll}
          onKeyDown={handleKeyDown}
          placeholder="Enter phone number"
          inputMode="numeric"
          maxLength={15}
        />
      </div>

      {error && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default PhoneNumber;
