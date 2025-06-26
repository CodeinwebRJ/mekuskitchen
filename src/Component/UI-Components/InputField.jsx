import style from "../../styles/InputField.module.css";
import { useRef } from "react";

const InputField = (props) => {
  const {
    labelName = "",
    placeholder = "",
    type = "text",
    name = "",
    maxLength,
    value = "",
    onChange = () => {},
    onBlur = () => {},
    error = "",
    icon = null,
  } = props;

  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (type === "number") {
      const newValue = e.target.value;
      if (/^\d*$/.test(newValue)) {
        onChange(e);
      }
    } else {
      onChange(e);
    }
  };

  const preventScroll = (e) => {
    if (type === "number") {
      e.target.blur();
      e.preventDefault();
    }
  };

  return (
    <div className={style.Container}>
      {labelName && (
        <label className={style.label} htmlFor={name}>
          {labelName}
        </label>
      )}

      <div className={style.InputFieldContainer}>
        {icon && <span className={style.icon}>{icon}</span>}
        <input
          id={name}
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          onBlur={onBlur}
          placeholder={placeholder}
          className={style.input}
          inputMode={type === "number" ? "numeric" : undefined}
          onWheel={preventScroll}
        />
      </div>
      {error && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;
