import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/Navbar2";
import Banner2 from "../../Component/Banner2";

function LoginPage() {
  const [credintials, setCredentials] = useState({
    unique_id: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credintials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credintials.unique_id || !credintials.password) {
      setError("Please enter both Unique ID and Password.");
      return;
    }

    setError("");

    try {
      // Send API request to login
      const response = await axios.post(
        "https://eyemesto.com/mapp_dev/signin.php",
        new URLSearchParams({
          signin: true,
          unique_id: credintials.unique_id,
          password: credintials.password,
        })
      );

      if (response.data.response === "1") {
        // Successful login
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("api_token", response.data.api_token);
        console.log("Login successful:", response.data);
        console.log("Login successful, navigating to home...");
        navigate("/");
      } else if (response.data.response === "0") {
        setError("Invalid Unique ID or password");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* <Navbar /> */}
      <Navbar2 />
      <Banner2 title="Login" secondtitle="Login" />

      <div className="container">
        <div
          style={{
            display: "flex",
            height: "80vh",
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
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
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
                <h4 className="card-title text-center mb-4">Log in</h4>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <input
                      // style={{
                      //   border: "none",
                      //   borderBottom: "1px solid black",
                      //   textDecoration: "none",
                      // }}
                      type="text"
                      className="form-control"
                      value={credintials.unique_id}
                      onChange={handleChange}
                      id="unique_id"
                      placeholder="Unique Id"
                      name="unique_id"
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
                      value={credintials.password}
                      onChange={handleChange}
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
                  {error && <p className="text-danger">{error}</p>}
                  <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms"
                      />
                      <label className="form-check-label" htmlFor="terms">
                        Remember me
                      </label>
                    </div>
                    <div>
                      <Link
                        to="/veryfy-email"
                        className="text-end"
                        style={{ textDecoration: "none" }}
                      >
                        Forget Password
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    style={{ borderRadius: "15px" }}
                  >
                    Login
                  </button>
                </form>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="mb-0">
                    don't have an account? <Link to="/signup">SIGNUP</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default LoginPage;
