import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";
import InputField from "../../Component/UI-Components/InputField";

function VerifyOtp({ formData, setFormData }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isSignupFlow = formData?.first_name && formData?.email;

  const handleSignupOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
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
          otp,
          refcode: formData.refcode,
        })
      );

      if (response.data.response === "1") {
        setMessage("Signup successful. Please login.");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          refcode: "",
          otp: "",
        });
        navigate("/login");
      } else {
        setErrors({ api: response.data.message || "Something went wrong." });
      }
    } catch (error) {
      setErrors({ api: "Error signing up. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOtpSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const storedOtp = localStorage.getItem("otp");

    if (Number(otp) === Number(storedOtp)) {
      setMessage("OTP verified successfully.");
      navigate("/forget-password");
    } else {
      setMessage("Error: OTP does not match. Please try again.");
    }
  };

  return (
    <>
      {!isSignupFlow && <Navbar2 />}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4">Verify OTP</h4>
                <form
                  className="was-validated"
                  onSubmit={
                    isSignupFlow
                      ? handleSignupOtpSubmit
                      : handleForgotPasswordOtpSubmit
                  }
                >
                  <div className="mb-3 mt-3">
                    <InputField
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      name="otp"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    disabled={loading}
                    style={{
                      backgroundColor: "var(--primary-blue)",
                      color: "var(--white)",
                      borderRadius: "14px",
                    }}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </form>

                {message && (
                  <div className="mt-3 alert alert-info">{message}</div>
                )}

                {errors.api && (
                  <div className="mt-3 alert alert-danger">{errors.api}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isSignupFlow && <Footer />}
    </>
  );
}

export default VerifyOtp;
