import React from "react";
import style from "../styles/InputField.module.css";

const InputField = (props) => {
  const {
    label = false,
    labelName = "",
    placeholder = "",
    type = "text",
    name = "",
    value = "",
    onChange = () => {},
    onBlur = () => {},
    error = "",
    touched,
  } = props;

  return (
    <div className={style.Container}>
      {label && (
        <label className={style.label} htmlFor={name}>
          {labelName}
        </label>
      )}

      <div className={style.InputFieldContainer}>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={style.input}
        />
      </div>
      {error && touched && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;
