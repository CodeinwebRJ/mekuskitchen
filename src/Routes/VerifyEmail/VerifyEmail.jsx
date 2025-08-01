import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";
import InputField from "../../Component/UI-Components/InputField";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({ email: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = { email: "" };

    if (!email.trim()) {
      validationErrors.email = "The field cannot be empty.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        validationErrors.email = "Please enter a valid email address.";
      }
    }

    setErrors(validationErrors);

    if (validationErrors.email) {
      return;
    }

    try {
      const response = await axios.post(
        "https://eyemesto.com/mapp/check_email.php",
        new URLSearchParams({
          check_email: true,
          method: "post",
          email: email,
        })
      );

      if (response.data.response === "1") {
        const userId = response.data.userid;
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", response.data.email);
        setMessage("OTP sent successfully!");
        navigate("/verify-otp");
      } else {
        console.log("Failed to send OTP:", response.data.message);
        setMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Please try again later.");
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="container mt-5">
        <div className="row justify-content-center my-5">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h4 className="card-title text-center mb-4">
                  Verify Your Email
                </h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <InputField
                      type="email"
                      value={email}
                      onChange={handleChange}
                      id="email"
                      placeholder="Email*"
                      name="email"
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </div>
                  <button type="submit" className="Button sm">
                    Verify
                  </button>
                </form>
                {message && (
                  <div
                    className={`mt-3 alert ${
                      message.includes("successfully")
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {message}
                  </div>
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

export default VerifyEmail;
