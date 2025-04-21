import React from "react";
import style from "../../styles/CheckboxFeild.module.css";

const CheckboxFeild = (props) => {
  const { checked, defaultChecked = false, onChange, onClick } = props;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={style.checkboxContainer}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={style.checkbox}
        defaultChecked={defaultChecked}
      />
    </div>
  );
};

export default CheckboxFeild;
