import style from "../../styles/Payment.module.css";
import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  CreatePayment,
  getUserCart,
  sendOrder,
} from "../../axiosConfig/AxiosConfig";
import OrderPlaced from "./OrderPlaced";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import PaymentFail from "./PaymentFail";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import InputField from "../../Component/UI-Components/InputField";

const PaymentCard = ({ handleCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showComponent, setShowComponent] = useState("payment");
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { defaultAddress } = useSelector((state) => state.address);

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
      setPaymentMethod((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === "expiryDate") {
      let digitsOnly = value.replace(/\D/g, "").slice(0, 4);
      if (digitsOnly.length >= 3) {
        digitsOnly = digitsOnly.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
      setPaymentMethod((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setPaymentMethod((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    if (!validateInputs()) {
      return;
    }

    try {
      const paymentData = {
        userId: user?.userid,
        amount: cart?.items?.grandTotal || 0,
        cardNumber: paymentMethod.cardNumber,
        expiryDate: paymentMethod.expiryDate,
        cvv: paymentMethod.cvv,
      };
      const res = await CreatePayment(paymentData);
      if (
        res.data.data.rawResponse.ResponseCode === "027" ||
        res.data.data.rawResponse.ResponseCode < "050" ||
        res.data.data.rawResponse.Complete === "true"
      ) {
        const data = {
          userId: user.userid,
          orderId: res.data.data.orderId,
          cartId: cart?.items?._id,
          addressId: defaultAddress?._id,
          cartAmount: cart?.items?.totalAmount || 0,
          taxAmount: cart?.items?.totalTax || 0,
          paymentMethod: "CARD",
        };
        await sendOrder(data);
        const response = await getUserCart({ id: user.userid });
        dispatch(setCart(response.data.data));
        setShowComponent("orderPlaced");
      }
      if (
        res.data.data.ResponseCode === "null" ||
        res.data.data.Complete === "null"
      ) {
        setShowComponent("fail");
      }
    } catch (error) {
      setShowComponent("fail");
      setApiError(
        error.response?.data?.message ||
          "An error occurred while processing the payment."
      );
      console.error("Payment Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    const errors = {};

    const cardDigits = paymentMethod.cardNumber.replace(/\s/g, "");
    if (cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      errors.cardNumber = "Enter a valid 16-digit card number";
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(paymentMethod.expiryDate)) {
      errors.expiryDate = "Enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = paymentMethod.expiryDate.split("/").map(Number);
      const now = new Date();
      const expiry = new Date(2000 + year, month - 1);
      if (expiry < now) {
        errors.expiryDate = "Card has expired";
      }
    }

    if (!/^\d{3,4}$/.test(paymentMethod.cvv)) {
      errors.cvv = "Enter a valid 3 or 4 digit CVV";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <>
      {showComponent === "payment" && (
        <div>
          <Header />
          <div className={style.paymentContainer}>
            {showComponent === "payment" && (
              <div className={style.cardContainer}>
                <div className={style.cardHeader}>
                  <FaCreditCard className={style.cardIcon} />
                  <h2 className={style.cardTitle}>Payment Details</h2>
                </div>
                <form className={style.form} onSubmit={handleSubmit}>
                  <div className={style.formGroup}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <InputField
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={style.inputField}
                      value={paymentMethod.cardNumber}
                      onChange={handleChange}
                      required
                      F
                    />
                  </div>

                  <div className={style.row}>
                    <div className={style.formGroup}>
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <InputField
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength="5"
                        className={style.inputField}
                        value={paymentMethod.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className={style.formGroup}>
                      <label htmlFor="cvv">CVV</label>
                      <InputField
                        type="password"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        maxLength="4"
                        className={style.inputField}
                        value={paymentMethod.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {apiError && <div className={style.error}>{apiError}</div>}

                  <div className={style.buttonContainer}>
                    <button
                      type="button"
                      className={style.cancelBtn}
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`${style.submitBtn} ${
                        isLoading ? style.loading : ""
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className={style.loader}></span>
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <Footer />
        </div>
      )}

      {showComponent === "orderPlaced" && (
        <div>
          <OrderPlaced />
        </div>
      )}

      {showComponent === "fail" && (
        <div>
          <PaymentFail setShowComponent={setShowComponent} />
        </div>
      )}
    </>
  );
};

export default PaymentCard;
