import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../styles/Password.module.css";

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.passwordInput}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className={styles.toggleButton}
      >
        {showPassword ? <FaEye /> : <FaEyeSlash />}
      </button>
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  );
};

export default PasswordInput;
