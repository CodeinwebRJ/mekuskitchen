import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  const handleSelectionChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (newValue) {
      if (enableNavigation) {
        navigate(`/product-category`);
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
        className={`form-select ${style.filterAndSort}`}
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

export default FilterAndSorting;
