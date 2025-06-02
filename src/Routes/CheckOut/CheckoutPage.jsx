import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import { getUserCart, sendOrder } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Link, useNavigate } from "react-router-dom";
import { BiMapPin } from "react-icons/bi";

const OrderSummary = ({ cart, isLoading, handleSubmit }) => (
  <section
    className={styles.orderSummaryContainer}
    aria-labelledby="order-summary-title"
  >
    <article className={styles.orderCard}>
      <h2 id="order-summary-title" className={styles.orderTitle}>
        Your Order
      </h2>
      <div className={styles.orderRow}>
        <span>PRODUCT</span>
        <span>SUBTOTAL</span>
      </div>
      {cart?.items?.products?.length > 0 ? (
        cart.items.products.map((item, index) => (
          <div key={item._id || index} className={styles.orderRow}>
            <span>{`${item.name} x ${item.quantity}`}</span>
            <span>${item.subtotal?.toFixed(2) || "0.00"}</span>
          </div>
        ))
      ) : (
        <div className={styles.orderRow}>No items in cart</div>
      )}
      <div className={styles.orderRow}>
        <span>Subtotal</span>
        <span>${cart?.items?.subtotal?.toFixed(2) || "0.00"}</span>
      </div>
      <div className={styles.orderRow}>
        <span>Shipping</span>
        <span>Self Pickup</span>
      </div>
      <div className={styles.orderRow}>
        <span>Tax</span>
        <span>${cart?.items?.taxAmount?.toFixed(2) || "0.00"}</span>
      </div>
      <div className={`${styles.orderRow} ${styles.total}`}>
        <span>TOTAL</span>
        <span>${cart?.items?.totalAmount || "0.00"}</span>
      </div>
      <div className={styles.paymentMethod}>
        <p>Debit Card</p>
        <p>You will be redirected to Moneris</p>
      </div>
      <Button
        type="button"
        className={styles.placeOrder}
        disabled={isLoading}
        onClick={handleSubmit}
        variant="primary"
        size="md"
        aria-label="Place order"
      >
        {isLoading ? "Processing..." : "Place Order"}
      </Button>
    </article>
  </section>
);

const AddressDisplay = ({ defaultAddress }) => (
  <section className={styles.addressDetails} aria-labelledby="address-title">
    <h1 className={styles.billingTitle}>Address</h1>
    <p className={styles.fullname}>
      {defaultAddress?.billing?.firstName || ""}{" "}
      {defaultAddress?.billing?.lastName || ""}
    </p>
    <p>{defaultAddress?.billing?.address || "N/A"}</p>
    <p>{defaultAddress?.billing?.city || "N/A"}</p>
    <p>
      {defaultAddress?.billing?.state || ""}{" "}
      {defaultAddress?.billing?.postcode || ""}
    </p>
    <p>{defaultAddress?.billing?.country || "N/A"}</p>
    <p>Phone - {defaultAddress?.billing?.phone || "N/A"}</p>
  </section>
);

const CheckoutPage = () => {
  const { defaultAddress } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    if (!cart?.items?._id || !defaultAddress?._id || !user?.userid) {
      setApiError("Missing required information (cart, address, or user ID).");
      return;
    }

    setIsLoading(true);
    setApiError("");
    try {
      const data = {
        userId: user.userid,
        cartId: cart.items._id,
        addressId: defaultAddress._id,
        paymentMethod: "COD",
        totalAmount: cart?.items?.totalAmount || 0,
      };
      await sendOrder(data);
      const response = await getUserCart(user.userid);
      dispatch(setCart(response.data.data));
      navigate("/");
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred while placing the order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <Banner name="Checkout" path="/cart" />
      <div className={styles.checkoutContainer}>
        {apiError && <p className={styles.errorMessage}>{apiError}</p>}
        {defaultAddress ? (
          <>
            <AddressDisplay defaultAddress={defaultAddress} />
            <OrderSummary
              cart={cart}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </>
        ) : (
          <section
            className={styles.noAddressContainer}
            aria-labelledby="no-address-title"
          >
            <BiMapPin className={styles.noAddressIcon} aria-hidden="true" />
            <h2 id="no-address-title" className={styles.noAddressTitle}>
              No Billing Address
            </h2>
            <p className={styles.errorMessage}>
              Please add a billing address to proceed with your order.
            </p>
            <Link to="/my-account/addresses">
              <Button
                variant="primary"
                size="md"
                className={styles.addAddressButton}
                aria-label="Add a billing address"
              >
                Add Address
              </Button>
            </Link>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
