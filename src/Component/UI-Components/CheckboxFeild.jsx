import style from "../../styles/CheckboxFeild.module.css";

const CheckboxField = (props) => {
  const { checked, onChange, onClick, size = "medium" } = props;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={`${style.checkboxContainer} ${style[size]}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className={style.checkbox}
      />
    </div>
  );
};

export default CheckboxField;
