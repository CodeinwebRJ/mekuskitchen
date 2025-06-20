import style from "../../styles/InputField.module.css";

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
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          onBlur={onBlur}
          placeholder={placeholder}
          className={style.input}
        />
      </div>
      {error && <div className={style.errorMessage}>{error}</div>}
    </div>
  );
};

export default InputField;
