import React from "react";
import style from "../../styles/SelectField.module.css";

const SelectField = (props) => {
  const {
    labelName = "",
    name = "",
    value = "",
    onChange = () => {},

    error = "",
    options = [],
    placeholder = "Select an option",
  } = props;

  return (
    <div className={style.Container}>
      {labelName && (
        <label className={style.label} htmlFor={name}>
          {labelName}
        </label>
      )}

      <div className={style.SelectFieldContainer}>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={style.select}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default SelectField;
