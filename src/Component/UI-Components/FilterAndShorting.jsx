import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import style from "../../styles/FilterAndShorting.module.css";

const FilterAndSorting = ({
  options = [],
  enableNavigation = false,
  onChange,
  placeholder = "Select a category",
  selectedValue = "",
}) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(selectedValue);

  // Sync local state with prop changes
  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  const handleSelectionChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue) {
      if (enableNavigation) {
        navigate(`/product-category/${newValue}`);
      }
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  return (
    <div className={style.filterContainer}>
      <select
        id="filter-select"
        className={style.filterAndSort}
        value={value}
        onChange={handleSelectionChange}
        aria-label={placeholder}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

FilterAndSorting.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  enableNavigation: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  selectedValue: PropTypes.string,
};

export default FilterAndSorting;
