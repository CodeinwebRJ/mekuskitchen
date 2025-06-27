import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";
import PasswordInput from "../../Component/Fields/Password";

function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const validateForm = () => {
    const validationErrors = {};

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}|[\]\\:";'<>?,./]).{8,}$/;

      if (!passwordRegex.test(password)) {
        validationErrors.password =
          "Use a strong password (A-Z, a-z, 0-9, !@#...)";
      }
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords does not match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User not found. Please login again.");
      return;
    }

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const localemail = localStorage.getItem("email");

    try {
      const response = await axios.post(
        "https://eyemesto.com/mapp/change_pass.php",
        new URLSearchParams({
          change_pass: true,
          method: "post",
          password: password,
          email: localemail,
        })
      );

      if (response.data.response === "1") {
        setMessage("Password updated successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("Failed to update password: " + response.data.message);
      }
    } catch (error) {
      setMessage("Error updating password. Please try again later.");
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4">
                  Reset Your Password
                </h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <PasswordInput
                      label="Password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    {errors.password && (
                      <div className="text-danger mt-1">{errors.password}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <PasswordInput
                      label="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                    />
                    {errors.confirmPassword && (
                      <div className="text-danger mt-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {message && (
                    <div className="alert alert-info py-2">{message}</div>
                  )}

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: "var(--primary-blue)",
                      color: "var(--white)",
                      borderRadius: "14px",
                    }}
                  >
                    Reset Password
                  </button>
                </form>
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
