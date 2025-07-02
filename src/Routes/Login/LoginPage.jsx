import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/LoginPage.module.css";
import Navbar2 from "../../Component/MainComponents/Navbar2";
import Loading from "../../Component/UI-Components/Loading";
import Banner2 from "../../Component/MainComponents/Banner2";
import Footer from "../../Component/MainComponents/Footer";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Store/Slice/UserAuthSlice";
import PasswordInput from "../../Component/Fields/Password";
import { Toast } from "../../Utils/Toast";
import CheckboxField from "../../Component/UI-Components/CheckboxFeild";
import InputField from "../../Component/UI-Components/InputField";

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

    if (!credentials.unique_id.trim()) {
      validationErrors.unique_id = "The field cannot be empty.";
    }
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
        Toast({ message: "Login Successfully", type: "success" });
        navigate("/");
      } else {
        setError((prev) => ({
          ...prev,
          api: "Please Enter Valid Id or Password",
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
      {loading && <Loading />}
      <Navbar2 />
      <Banner2 title="Login" name="Home" path="/" />

      <div className={styles.container}>
        <div className={styles.loginWrapper}>
          <div className={styles.imageSection}>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              alt="Decorative"
            />
          </div>
          <div className={styles.formSection}>
            <div className={styles.card}>
              <h2 className={styles.title}>Log in</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <InputField
                    type="text"
                    id="unique_id"
                    name="unique_id"
                    placeholder="Unique Id*"
                    value={credentials.unique_id}
                    onChange={handleChange}
                    required
                  />
                  {error.unique_id && (
                    <div className={styles.errorText}>{error.unique_id}</div>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <PasswordInput
                    placeholder="Password*"
                    onChange={handleChange}
                    value={credentials.password}
                    label="Password"
                    name="password"
                  />
                  {error.password && (
                    <div className={styles.errorText}>{error.password}</div>
                  )}
                </div>

                {error.api && (
                  <div className={styles.apiError}>{error.api}</div>
                )}

                <div className={styles.rememberForgot}>
                  <div className={styles.rememberCheckbox}>
                    <CheckboxField
                      size="small"
                      checked={rememberMe}
                      onChange={handleCheckboxChange}
                      id="rememberMe"
                    />
                    <label
                      className={styles.checkboxLabel}
                      htmlFor="rememberMe"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link to="/verify-email" className={styles.forgotLink}>
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={styles.loginButton}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <hr className={styles.separator} />
              <div className={styles.signupPrompt}>
                Don't have an account?
                <Link to="/signup" className={styles.signupLink}>
                  SIGNUP
                </Link>
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
