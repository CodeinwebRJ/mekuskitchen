import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import style from "../../styles/FilterAndShorting.module.css";
import { setCategory } from "../../../Store/Slice/ProductSlice";

const FilterAndSorting = ({
  options = [],
  enableNavigation = false,
  onChange,
  placeholder = "Select a category",
}) => {
  const { category } = useSelector((state) => state.product);
  const [selectedValue, setSelectedValue] = useState(category || "");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedValue(category || "");
  }, [category]);

  const handleSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    if (value) {
      if (enableNavigation) {
        navigate(`/product-category/${value}`);
        dispatch(setCategory(value));
      }
      if (onChange) {
        onChange(value);
      }
    }
  };

  return (
    <div className={style.filterContainer}>
      <select
        id="filter-select"
        className={style.filterAndSort}
        value={selectedValue}
        onChange={handleSelectionChange}
        aria-label={placeholder}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id || option.value} value={option.value}>
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  enableNavigation: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default FilterAndSorting;
