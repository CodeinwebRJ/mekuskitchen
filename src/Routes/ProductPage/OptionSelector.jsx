import style from "../../styles/ProductPage.module.css";

const OptionSelector = ({
  options,
  selected,
  onSelect,
  label,
  isCompatible,
  suffix = "",
}) => {  
  return (
    <div className={style.storageContainer}>
      <h6>
        {label}:{" "}
        {options.map((option, idx) => (
          <button
            key={idx}
            className={`${style.storage} ${
              selected === option ? style.selected : ""
            }`}
            onClick={() => onSelect(option)}
            disabled={isCompatible ? !isCompatible(option) : false}
            aria-label={`Select ${option} ${label}`}
          >
            {option} {suffix}
          </button>
        ))}
      </h6>
    </div>
  );
};

export default OptionSelector;
