import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedOtp = localStorage.getItem("otp");

    if (Number(otp) === Number(storedOtp)) {
      setMessage("OTP verified successfully.");
      console.log("OTP verified successfully, navigating to forget-password");

      // Redirect to the change-password page
      navigate("/forget-password");
    } else {
      console.log("Failed to verify OTP: OTP does not match");
      setMessage("Error: OTP does not match. Please try again.");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <Navbar2 />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4">Verify OTP</h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <input
                      style={{
                        border: "1px solid #ccc",
                        textDecoration: "none",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      name="otp"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: "#46a3df",
                      color: "#fff",
                      borderRadius: "14px",
                    }}
                  >
                    Verify
                  </button>
                </form>
                {message && (
                  <div className="mt-3 alert alert-info">{message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default VerifyOtp;
