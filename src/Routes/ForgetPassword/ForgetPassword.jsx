import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/Navbar2";
import Footer from "../../Component/MainComponents/Footer";

function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not found. Please login again.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    // Password validation using regex
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://eyemesto.com/mapp/change_pass.php",
        new URLSearchParams({
          change_pass: true,
          method: "post",
          password: password,
        })
      );

      // Check if the password was successfully changed
      if (response.data.response === "1") {
        setMessage("Password updated successfully!");
        console.log("Password changed successfully. Navigating to login.");

        // Redirect to login page or another relevant page
        navigate("/login");
      } else {
        setMessage("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      setMessage("Error updating password. Please try again later.");
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
      {/* new one */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4">
                  Reset Your Password
                </h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3" style={{ position: "relative" }}>
                    <input
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        textDecoration: "none",
                      }}
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                        <i className="fas fa-eye-slash"></i>
                      ) : (
                        <i className="fas fa-eye"></i>
                      )}
                    </button>
                  </div>

                  <div className="mb-3" style={{ position: "relative" }}>
                    <input
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        textDecoration: "none",
                      }}
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="ConfirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      name="ConfirmPassword"
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
                        <i className="fas fa-eye-slash"></i>
                      ) : (
                        <i className="fas fa-eye"></i>
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ borderRadius: "15px" }}
                  >
                    Reset Password
                  </button>
                </form>
                {message && (
                  <div className="mt-3 alert alert-info">{message}</div>
                )}

                <hr className="my-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgetPassword;
