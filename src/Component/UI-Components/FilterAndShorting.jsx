import React from "react";
import style from "../../styles/FilterAndShorting.module.css";

const FilterAndShorting = (props) => {
  const { options, placeholder } = props;

  return (
    <select className={style.filterAndSort}>
      <option value="" defaultValue>
        {placeholder}
      </option>
      {options &&
        options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
  );
};

export default FilterAndShorting;
