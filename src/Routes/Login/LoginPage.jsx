import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Loading from "../../Component/UI-Components/Loading";
import Banner2 from "../../Component/MainComponents/Banner2";
import Footer from "../../Component/MainComponents/Footer";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Store/Slice/UserSlice";
import PasswordInput from "../../Component/Fields/Password";
import { Toast } from "../../Utils/Toast";

function LoginPage() {
  const [credentials, setCredentials] = useState({
    unique_id: "",
    password: "",
  });
  const [error, setError] = useState({
    unique_id: "",
    password: "",
    api: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    // Clear error for the field being edited
    setError((prev) => ({
      ...prev,
      [name]: "",
      api: "",
    }));
  };

  const handleCheckboxChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Validate unique_id
    if (!credentials.unique_id.trim()) {
      validationErrors.unique_id = "The field cannot be empty.";
    }

    // Validate password
    if (!credentials.password.trim()) {
      validationErrors.password = "The field cannot be empty.";
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://eyemesto.com/mapp_dev/signin.php",
        new URLSearchParams({
          signin: true,
          unique_id: credentials.unique_id,
          password: credentials.password,
        })
      );
      if (response.data.response === "1") {
        dispatch(setUser(response.data));
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("api_token", response.data.api_token);
        }
        Toast({
          message: "Login Successfully",
          type: "success",
        });
        navigate("/");
      } else if (response.data.response === "0") {
        setError((prev) => ({
          ...prev,
          api: "Please Enter Valid Id or Password",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          api: "Login failed. Please check your credentials.",
        }));
      }
    } catch (err) {
      console.error(err);
      setError((prev) => ({
        ...prev,
        api: "An error occurred. Please try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      {loading && (
        <div>
          <Loading />
        </div>
      )}
      <Navbar2 />
      <Banner2 title="Login" />

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
                <h2 className="text-center mb-4">Log in</h2>
                <form className="was-validated" onSubmit={handleSubmit}>
                  <div className="mb-3 mt-3">
                    <input
                      type="text"
                      value={credentials.unique_id}
                      onChange={handleChange}
                      id="unique_id"
                      placeholder="Unique Id*"
                      name="unique_id"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        width: "100%",
                        padding: "10px 12px",
                      }}
                    />
                    {error.unique_id && (
                      <div className="text-danger">{error.unique_id}</div>
                    )}
                  </div>
                  <PasswordInput
                    placeholder="Password*"
                    onChange={handleChange}
                    value={credentials.password}
                    label="Password"
                    name="password"
                    error={error.password}
                  />
                  {error.api && (
                    <div className="text-danger mb-3">{error.api}</div>
                  )}
                  <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={handleCheckboxChange}
                        style={{ border: "1px solid black" }}
                      />
                      <label
                        style={{ color: "black" }}
                        className="form-check-label"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <div>
                      <Link
                        to="/verify-email"
                        className="text-end"
                        style={{ color: "#46a3df" }}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{
                      backgroundColor: "#46a3df",
                      color: "#fff",
                      borderRadius: "14px",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ color: "#46a3df" }}>
                      SIGNUP
                    </Link>
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

export default LoginPage;
