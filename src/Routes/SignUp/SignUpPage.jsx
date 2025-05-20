import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../Component/MainComponents/Footer";
import Navbar2 from "../../Component/Navbar2";
import Banner2 from "../../Component/MainComponents/Banner2";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords and Confirm password do not match.");
      return;
    }

    //phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.mobile)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "password must be at 8 character long, contain at least one uppercase letter, one lowercase letter, and one special character."
      );
      return;
    }

    setLoading(true);
    setError("");

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
        setError(
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        console.error("Response data: ", err.response.data);
        console.error("Response status: ", err.response.status);
      } else if (err.request) {
        console.error("Request data: ", err.request);
      } else {
        console.error("Error message: ", err.message);
      }
      setError("Error signing up. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      {/* <Navbar /> */}
      <Navbar2 />
      <Banner2 title="Signup" secondtitle="signup" />
      <div className="container">
        <div
          style={{
            display: "flex",
            height: "100vh",
          }}
          className="mt-5 d-flex align-items-stretch"
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
                padding: "40px 80px",
              }}
            >
              <div className="card-body p-0">
                <h4 className="card-title text-center mb-4">Sign up</h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="form-control"
                      id="first_name"
                      placeholder="First Name"
                      name="first_name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      //   width: "100%",
                      // }}
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="form-control"
                      id="last_name"
                      placeholder="Last Name"
                      name="last_name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      name="email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type="number"
                      className="form-control"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      name="mobile"
                      required
                    />
                  </div>
                  <div className="mb-3" style={{ position: "relative" }}>
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="btn btn-link"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "2px",
                        fontSize: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </button>
                  </div>
                  <div className="mb-3" style={{ position: "relative" }}>
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="btn btn-link"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "2px",
                        fontSize: "16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {showConfirmPassword ? (
                        <i className="fas fa-eye"></i>
                      ) : (
                        <i className="fas fa-eye-slash"></i>
                      )}
                    </button>
                  </div>
                  <div className="mb-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type="text"
                      className="form-control"
                      id="refcode"
                      value={formData.refcode}
                      onChange={handleInputChange}
                      placeholder="Referral Code"
                      name="refcode"
                    />
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  {/* <div className="d-flex justify-content-between mb-3"> */}
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="terms"
                    />
                    <label className="form-check-label" htmlFor="terms">
                      I agree all statements in
                      <span style={{ color: "grey" }}>Terms of service</span>
                    </label>
                  </div>
                  {/* </div> */}

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2"
                    style={{ borderRadius: "15px" }}
                  >
                    Signup
                  </button>
                </form>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account? <Link to="/login">LOGIN</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SignUpPage;
