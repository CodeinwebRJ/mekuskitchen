import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../Component/MainComponents/Footer";
import PasswordInput from "../../Component/Fields/Password";
import Banner2 from "../../Component/MainComponents/Banner2";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import VerifyOtp from "../VerifyOtp/VerifyOtp";
import style from "../../styles/SignupPage.module.css";
import InputField from "../../Component/UI-Components/InputField";

function SignUpPage() {
  const [show, setShow] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    refcode: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerifiyEmail = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.first_name.trim()) {
      validationErrors.first_name = "First Name is required.";
    }

    if (!formData.last_name.trim()) {
      validationErrors.last_name = "Last Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(formData.mobile)) {
      validationErrors.mobile = "Please enter a valid phone number";
    }

    if (formData.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    } else {
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(
        formData.password
      );

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        validationErrors.password =
          "Use a strong password (A-Z, a-z, 0-9, !@#...)";
      }
    }

    if (!formData.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Please enter a confirmPassword.";
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword =
        "Passwords does not match. Please try again.";
    }

    const termsCheckbox = document.getElementById("terms");
    if (!termsCheckbox.checked) {
      validationErrors.terms = "You must agree to the Terms of service.";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://eyemesto.com/mapp_dev/verify_email.php",
        new URLSearchParams({
          email: formData.email,
          verify_email: true,
          mobile: formData.mobile,
        })
      );

      if (response.data.response === "1") {
        setShow(true);
      }
    } catch (err) {
      console.error(err);
      setErrors({ api: "Error signing up. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar2 />
      <Banner2 title="Sign Up" name="Login" path="/login" />

      {show ? (
        <VerifyOtp formData={formData} setFormData={setFormData} />
      ) : (
        <div className={style.containerCustom}>
          <div className={style.imageWrapper}>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
              alt="Decorative"
              className={style.image}
            />
          </div>

          <div className={style.cardWrapper}>
            <div className={style.cardContent}>
              <h2 className={style.title}>Sign up</h2>
              <form className={style.form} onSubmit={handleVerifiyEmail}>
                <div className={style.formGroup}>
                  <InputField
                    className={style.inputField}
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    id="first_name"
                    placeholder="First Name*"
                    name="first_name"
                  />
                  {errors.first_name && (
                    <div className={style.error}>{errors.first_name}</div>
                  )}
                </div>
                <div className={style.formGroup}>
                  <InputField
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    id="last_name"
                    placeholder="Last Name*"
                    name="last_name"
                  />
                  {errors.last_name && (
                    <div className={style.error}>{errors.last_name}</div>
                  )}
                </div>
                <div className={style.formGroup}>
                  <InputField
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    id="email"
                    placeholder="Email*"
                    name="email"
                  />
                  {errors.email && (
                    <div className={style.error}>{errors.email}</div>
                  )}
                </div>
                <div className={style.formGroup}>
                  <InputField
                    type="number"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="Phone*"
                    name="mobile"
                  />
                  {errors.mobile && (
                    <div className={style.error}>{errors.mobile}</div>
                  )}
                </div>

                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password*"
                  error={errors.password}
                />
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password*"
                  error={errors.confirmPassword}
                />

                <div className={style.formGroup}>
                  <InputField
                    type="text"
                    id="refcode"
                    value={formData.refcode}
                    onChange={handleInputChange}
                    placeholder="Referral Code"
                    name="refcode"
                  />
                </div>

                <div className={style.formCheck}>
                  <input
                    type="checkbox"
                    className={style.checkbox}
                    id="terms"
                  />
                  <label className={style.termsLabel} htmlFor="terms">
                    I agree all statements in Terms of service
                  </label>
                </div>
                {errors.terms && (
                  <div className={style.error}>{errors.terms}</div>
                )}
                {errors.api && <div className={style.error}>{errors.api}</div>}

                <button
                  type="submit"
                  className={style.signupButton}
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>

              <hr className={style.divider} />
              <div className={style.loginLink}>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className={style.loginAnchor}>
                    LOGIN
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default SignUpPage;
