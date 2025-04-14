import React from "react";
import style from "../styles/Button.module.css";

const Button = (props) => {
  const {
    children,
    type = "button",
    variant = "primary",
    className = "",
    onClick = () => {},
    onBlur = () => {},
    onChange = () => {},
    onFocus = () => {},
    disabled = false,
  } = props;

  return (
    <button
      type={type}
      className={`${style.submitButton} ${style[variant]} ${className} ${
        disabled && style.disabled
      }`}
      onClick={onClick}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
