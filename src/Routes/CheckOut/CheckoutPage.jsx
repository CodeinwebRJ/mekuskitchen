import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import {
  ActiveUserAddress,
  DeleteUserAddress,
  getUserAddress,
  getUserCart,
  sendOrder,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Link, useNavigate } from "react-router-dom";
import AddressCard from "../../Component/Cards/AddressCard";
import {
  deleteAddress,
  setAddresses,
  setDefaultAddress,
  setShowAddressForm,
} from "../../../Store/Slice/AddressSlice";
import AddAddressCard from "../../Component/UI-Components/AddAddressCard";
import AddressForm from "../MyAccount/Addresses/AddressForm";
import DialogBox from "../../Component/MainComponents/DialogBox";
import CouponCode from "../../Component/Cards/CouponCode";

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
    <div className={style.total}>
      SubTotal: <span>${total.toFixed(2)}</span>
    </div>
    {discount > 0 && (
      <div>
        Discount:{" "}
        <span className="discount">
          -${discount.toFixed(2)} ({discountPercentage.toFixed(2)}%)
        </span>
      </div>
    )}
    <hr />
    <div className={style.total}>
      Tax: <span className={style.price}>${tax}</span>
    </div>
    <hr />
    <div className={style.total}>
      Total: <p>${(Number(total) + Number(tax)).toFixed(2)}</p>
    </div>
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

const CheckoutPage = () => {
  const { defaultAddress, addresses, showAddressForm } = useSelector(
    (state) => state.address
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [dialog, setDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async () => {
    if (!isAuthenticated) {
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
        (acc, item) => acc + item.price * item.quantity,
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
        (acc, item) => acc + (item.price - item.price) * item.quantity,
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

  const fetchAddress = async () => {
    try {
      const response = await getUserAddress(user.userid);
      if (response.status === 200) {
        const data = response?.data?.data || [];
        dispatch(setAddresses(data));
        const activeAddress = data.find((addr) => addr.isActive);
        if (activeAddress) dispatch(setDefaultAddress(activeAddress));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSetAsDefaultAddress = async (addressId) => {
    try {
      const data = {
        userId: user.userid,
        addressId: addressId,
      };
      const response = await ActiveUserAddress(data);
      if (response.status === 200) {
        fetchAddress();
      }
    } catch (error) {
      console.error("Error activating address:", error);
    }
  };

  return (
    <div className={style.mainContainer}>
      <Header />
      <Banner name="Checkout" path="/cart" />
      <div className={style.checkoutContainer}>
        <>
          <div>
            <div className={style.addressContainer}>
              {addresses.length < 3 ? (
                <AddAddressCard
                  onClick={() => {
                    dispatch(setShowAddressForm(true));
                    setIsEdit(false);
                    setDialog(true);
                  }}
                />
              ) : null}
              {addresses &&
                addresses.map((address, index) => (
                  <AddressCard
                    key={index}
                    address={address}
                    handleSetAsDefaultAddress={handleSetAsDefaultAddress}
                  />
                ))}
            </div>
            <div>
              <CouponCode />
            </div>
          </div>
          <OrderSummary
            total={total}
            discount={discount}
            isLoading={isLoading}
            discountPercentage={discountPercentage}
            handleSubmit={handleSubmit}
            tax={cart?.items?.totalTax}
          />
        </>

        <DialogBox
          isOpen={dialog}
          title="Add Delivery Address"
          onClose={() => setDialog(false)}
        >
          <AddressForm
            onClose={() => setDialog(false)}
            fetchAddress={fetchAddress}
          />
        </DialogBox>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
