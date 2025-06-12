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
    setPaymentMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

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
        res.data.data.ResponseCode === "027" ||
        res.data.data.Complete === "true"
      ) {
        const data = {
          userId: user.userid,
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

  return (
    <>
      {showComponent === "payment" && (
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
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={style.inputField}
                    value={paymentMethod.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={style.row}>
                  <div className={style.formGroup}>
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
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
                    <input
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
