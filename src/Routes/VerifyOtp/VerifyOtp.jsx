import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";
import InputField from "../../Component/UI-Components/InputField";
import styles from "../../styles/Verifyotp.module.css";

function VerifyOtp({ formData, setFormData }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigate = useNavigate();

  const isSignupFlow = formData?.first_name && formData?.email;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setResendEnabled(false);
    setTimer(60);
    setMessage("");

    try {
      if (isSignupFlow) {
        const response = await axios.post(
          "https://eyemesto.com/mapp_dev/resend_otp.php",
          new URLSearchParams({
            email: formData.email,
            mobile: formData.mobile,
          })
        );
        setMessage(response.data.message || "OTP resent successfully.");
      } else {
        setMessage("OTP resent to your registered contact.");
      }
    } catch (error) {
      setErrors({ api: "Failed to resend OTP. Please try again." });
    }
  };

  const handleSignupOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid OTP." });
      setLoading(false);
      return;
    }

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
    if (!otp || otp.length !== 6) {
      setErrors({ otp: "Please enter a valid OTP." });
      return;
    }
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
      <div className={styles.container}>
        <div className={styles.centerRow}>
          <div className={styles.column}>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <h4 className={styles.heading}>Verify OTP</h4>
                <form
                  className={styles.form}
                  onSubmit={
                    isSignupFlow
                      ? handleSignupOtpSubmit
                      : handleForgotPasswordOtpSubmit
                  }
                >
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
                  {errors.otp && (
                    <div className={styles.inputError}>{errors.otp}</div>
                  )}

                  <div className={styles.resendWrapper}>
                    <div className={styles.timer}>
                      {timer > 0 && <span>Resend OTP in {timer}s</span>}
                    </div>
                    <div
                      className={`${styles.resendLink} ${
                        resendEnabled ? styles.enabled : styles.disabled
                      }`}
                      onClick={resendEnabled ? handleResendOtp : undefined}
                    >
                      Resend OTP
                    </div>
                  </div>

                  <button type="submit" className={styles.verifyBtn}>
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                </form>
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
