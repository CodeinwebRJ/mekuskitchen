import style from "../../styles/InputField.module.css";

const InputField = (props) => {
  const {
    labelName = "",
    placeholder = "",
    type = "text",
    name = "",
    value = "",
    onChange = () => {},
    onBlur = () => {},
    error = "",
  } = props;

  return (
    <div className={style.Container}>
      {labelName && (
        <label className={style.label} htmlFor={name}>
          {labelName}
        </label>
      )}

      <div className={style.InputFieldContainer}>
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={style.input}
        />
      </div>
      {/* {error && <div className={style.errorMessage}>{error}</div>} */}
    </div>
  );
};

export default InputField;
