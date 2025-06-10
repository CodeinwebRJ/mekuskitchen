import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Footer from "../../Component/MainComponents/Footer";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const api_token = localStorage.getItem("api_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://eyemesto.com/mapp/check_email.php",
        new URLSearchParams({
          check_email: true,
          method: "post",
          api_token: api_token,
          email: email,
        })
      );

      if (response.data.response === "1") {
        // console.log(response);
        // Store only userId in localStorage
        const userId = response.data.userid;
        localStorage.setItem("userId", userId);
        // Store OTP in localStorage
        localStorage.setItem("otp", response.data.OTP);
        navigate("/verify-otp");
      } else {
        console.log("Failed to send OTP:", response.data.message);
        // setMessage("Error: " + response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
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
                    <input
                      style={{
                        border: "1px solid black",
                        textDecoration: "none",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        width: "100%",
                      }}
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ borderRadius: "15px" }}
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

export default VerifyEmail;
