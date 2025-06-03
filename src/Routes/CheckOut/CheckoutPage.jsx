import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import { getUserCart, sendOrder } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Link, useNavigate } from "react-router-dom";
import { BiMapPin } from "react-icons/bi";

const OrderSummary = ({
  total,
  discount,
  discountPercentage,
  tax,
  handleSubmit,
  isLoading,
}) => (
  <div className={style.cartTotals}>
    <h3 className={style.cartTitle}>Cart Totals</h3>
    <p className={style.total}>
      SubTotal: <strong>${total.toFixed(2)}</strong>
    </p>
    {discount > 0 && (
      <p>
        Discount:{" "}
        <span className="discount">
          -${discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
        </span>
      </p>
    )}
    <hr />
    <p className={style.total}>
      Tax: <span className={style.price}>${tax}</span>
    </p>
    <hr />
    <p className={style.total}>
      Total: <strong>${(Number(total) + Number(tax)).toFixed(2)}</strong>
    </p>
    <hr />

    <Link to="/checkout">
      <div className={style.checkoutButton}>
        <Button
          type="button"
          disabled={isLoading}
          onClick={handleSubmit}
          variant="primary"
          size="md"
          aria-label="Place order"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </Link>
  </div>
);

const AddressDisplay = ({ defaultAddress }) => (
  <section className={style.addressDetails} aria-labelledby="address-title">
    <h1 className={style.billingTitle}>Address</h1>
    <p className={style.fullname}>
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
    if (!user?.userid) {
      setApiError("Missing required information (cart, address, or user ID).");
      return;
    }

    setIsLoading(true);
    setApiError("");
    try {
      const data = {
        userId: user.userid,
        cartId: cart?.items?._id,
        addressId: defaultAddress._id,
        paymentMethod: "COD",
        totalAmount: cart?.items?.totalAmount || 0,
      };

      console.log(data);
      await sendOrder(data);
      const response = await getUserCart({ id: user.userid });
      dispatch(setCart(response.data.data));
      if (response.status === 200) {
        navigate("/order-placed");
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          "An error occurred while placing the order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCart = async () => {
    try {
      const data = {
        id: user?.userid,
        provinceCode: defaultAddress?.billing?.postcode,
      };
      const res = await getUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const total = useMemo(
    () =>
      (cart?.items?.items?.reduce(
        (acc, item) => acc + item.productDetails.sellingPrice * item.quantity,
        0
      ) || 0) +
      (cart?.items?.tiffins?.reduce(
        (acc, item) =>
          acc + (item.tiffinMenuDetails?.totalAmount || 0) * item.quantity,
        0
      ) || 0),
    [cart]
  );

  const discount = useMemo(
    () =>
      cart?.items?.items?.reduce(
        (acc, item) =>
          acc +
          (item.productDetails.price - item.productDetails.sellingPrice) *
            item.quantity,
        0
      ) || 0,
    [cart]
  );

  const discountPercentage = useMemo(() => {
    if (total === 0) return 0;
    return (discount / total) * 100;
  }, [discount, total]);

  useEffect(() => {
    if (user?.userid && defaultAddress?.billing?.postcode) {
      fetchUserCart();
    }
  }, [user?.userid, defaultAddress?.billing?.postcode]);

  return (
    <div className={style.mainContainer}>
      <Header />
      <Banner name="Checkout" path="/cart" />
      <div className={style.checkoutContainer}>
        {defaultAddress ? (
          <>
            <AddressDisplay defaultAddress={defaultAddress} />
            <OrderSummary
              total={total}
              discount={discount}
              isLoading={isLoading}
              discountPercentage={discountPercentage}
              handleSubmit={handleSubmit}
              tax={cart?.items?.totalTax}
            />
          </>
        ) : (
          <section
            className={style.noAddressContainer}
            aria-labelledby="no-address-title"
          >
            <BiMapPin className={style.noAddressIcon} aria-hidden="true" />
            <h2 id="no-address-title" className={style.noAddressTitle}>
              No Billing Address
            </h2>
            <p className={style.errorMessage}>
              Please add a billing address to proceed with your order.
            </p>
            <Link to="/my-account/addresses">
              <Button
                variant="primary"
                size="md"
                className={style.addAddressButton}
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
