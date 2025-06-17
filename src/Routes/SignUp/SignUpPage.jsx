import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../Component/MainComponents/Footer";
import PasswordInput from "../../Component/Fields/Password";
import Banner2 from "../../Component/MainComponents/Banner2";
import Navbar2 from "../../Component/MainComponents/Navbar2";

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

function SignUpPage() {
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
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
          "Password must include uppercase, lowercase, number, and special character.";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
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
        "https://eyemesto.com/mapp_dev/signup.php",
        new URLSearchParams({
          signup: true,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          refcode: formData.refcode,
        })
      );

      if (response.data.response === "1") {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          refcode: "",
        });
        navigate("/login");
      } else {
        setErrors({ api: response.data.message || "Something went wrong." });
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
      <Banner2 title="Sign Up" />

      <div className="container">
        <div
          className="mt-5 d-flex align-items-stretch"
          style={{ height: "120vh" }}
        >
          <div className="col-lg-6 col-md-8 p-0">
            <div
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                alt="Decorative"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-8 d-flex align-items-center">
            <div
              className="card shadow w-100"
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                padding: "20px 40px",
              }}
            >
              <div className="card-body p-0">
                <h2 className="card-title text-center mb-4">Sign up</h2>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <input
                      style={inputStyle}
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      id="first_name"
                      placeholder="First Name*"
                      name="first_name"
                    />
                    {errors.first_name && (
                      <div className="text-danger">{errors.first_name}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      style={inputStyle}
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      id="last_name"
                      placeholder="Last Name*"
                      name="last_name"
                    />
                    {errors.last_name && (
                      <div className="text-danger">{errors.last_name}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      style={inputStyle}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      id="email"
                      placeholder="Email*"
                      name="email"
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      style={inputStyle}
                      type="number"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Phone*"
                      name="mobile"
                    />
                    {errors.mobile && (
                      <div className="text-danger">{errors.mobile}</div>
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
                  <div className="mb-3">
                    <input
                      style={inputStyle}
                      type="text"
                      id="refcode"
                      value={formData.refcode}
                      onChange={handleInputChange}
                      placeholder="Referral Code"
                      name="refcode"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      style={{ border: "1px solid black" }}
                      id="terms"
                    />
                    <label
                      style={{ color: "black" }}
                      className="form-check-label"
                      htmlFor="terms"
                    >
                      I agree all statements in Terms of service
                    </label>
                  </div>
                  {errors.terms && (
                    <div className="text-danger mt-1">{errors.terms}</div>
                  )}
                  {errors.api && (
                    <div className="text-danger mt-2">{errors.api}</div>
                  )}
                  <button
                    type="submit"
                    className="btn  w-100 mt-2"
                    style={{
                      backgroundColor: "#46a3df",
                      color: "#fff",
                      borderRadius: "14px",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Signup"}
                  </button>
                </form>

                <hr className="my-4" />
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#46a3df" }}>
                      LOGIN
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUpPage;
