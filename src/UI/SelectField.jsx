import React from "react";
import style from "../styles/SelectField.module.css";

const SelectField = (props) => {
  const {
    label = false,
    labelName = "",
    name = "",
    value = "",
    onChange = () => {},
    onBlur = () => {},
    error = "",
    touched = false,
    options = [],
    placeholder = "Select an option",
  } = props;

  return (
    <div className={style.Container}>
      {label && (
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
          onBlur={onBlur}
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
      {error && touched && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default SelectField;
