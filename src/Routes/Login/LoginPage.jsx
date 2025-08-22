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
import {
  BulkUploadCart,
  BulkUploadTiffinCart,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";

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
        "https://eyemesto.com/mapp/signin.php",
        new URLSearchParams({
          signin: true,
          unique_id: credentials.unique_id,
          password: credentials.password,
        })
      );

      if (response.data.response === "1") {
        dispatch(setUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("api_token", response.data.api_token);
        localStorage.setItem("isLoggedIn", "true");
        Toast({ message: "Login Successfully", type: "success" });
        await UploadBulkCart();
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

  const UploadBulkCart = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData.userid) {
        return;
      }
      if (localCart?.items?.length > 0) {
        const items = localCart.items.map((item) => {
          const skuDetails = item.sku?.details || {};
          const combination =
            item?.combination || skuDetails?.combinations || {};

          return {
            product_id: item._id,
            quantity: parseInt(item.quantity || 1),
            price: parseFloat(combination.Price || item.price || 0),
            skuId: item.sku?._id || null,
            combination,
          };
        });
        if (items.length > 0) {
          const payload = {
            user_id: userData.userid,
            items,
          };
          const res = await BulkUploadCart(payload);
          dispatch(setCart(res.data.data));
          localStorage.removeItem("cart");
        }
      } else {
        const tiffins = localCart.tiffins?.map((tiffin) => {
          return {
            tiffinMenuId: tiffin.tiffinMenuId || tiffin._id,
            day: tiffin.day,
            deliveryDate: tiffin.deliveryDate || tiffin.date,
            orderDate:
              tiffin.orderDate ||
              new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1) +
                "-" +
                new Date().getDate(),
            customizedItems: (tiffin.customizedItems || tiffin.items).map(
              (item) => ({
                name: item.name,
                price: item.price,
                quantity: parseInt(item.quantity) || 1,
                weight: item.weight || "",
                weightUnit: item.weightUnit || "",
                description: item.description || "",
              })
            ),
            quantity: parseInt(tiffin.quantity || 1),
            price: parseFloat(tiffin.price || 0),
            specialInstructions: tiffin.specialInstructions || "NA",
          };
        });
        if (tiffins.length > 0) {
          const payload = {
            user_id: userData.userid,
            tiffins,
          };
          const res = await BulkUploadTiffinCart(payload);
          dispatch(setCart(res.data.data));
          localStorage.removeItem("cart");
        }
      }
    } catch (error) {
      console.error("Error uploading bulk cart:", error);
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

                <button type="submit" className="Button sm" disabled={loading}>
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
