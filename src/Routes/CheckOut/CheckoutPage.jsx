import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import style from "../../styles/CheckoutPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import {
  ActiveUserAddress,
  getUserAddress,
  getUserCart,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Link } from "react-router-dom";
import AddressCard from "../../Component/Cards/AddressCard";
import {
  setAddresses,
  setDefaultAddress,
  setSelfPickup,
  setShowAddressForm,
} from "../../../Store/Slice/AddressSlice";
import AddAddressCard from "../../Component/UI-Components/AddAddressCard";
import AddressForm from "../MyAccount/Addresses/AddressForm";
import DialogBox from "../../Component/MainComponents/DialogBox";
import PaymentCard from "./PaymentCard";
import CheckboxField from "../../Component/UI-Components/CheckboxFeild";

const OrderSummary = ({
  total,
  discount,
  discountPercentage,
  tax,
  payNow,
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
    <div className={style.total}>
      Tax: <span className={style.price}>${tax}</span>
    </div>
    <hr />
    <div className={style.total}>
      Total: <p>${(Number(total) + Number(tax)).toFixed(2)}</p>
    </div>

    <Link to="/checkout">
      <div className={style.checkoutButton}>
        <button disabled={isLoading} onClick={payNow} className="Button md">
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </Link>
  </div>
);

const CheckoutPage = () => {
  const { defaultAddress, addresses, selfPickup } = useSelector(
    (state) => state.address
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [dialog, setDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showComponent, setShowComponent] = useState("cart");

  const payNow = () => {
    setShowComponent("payment");
  };

  const handleCancel = () => {
    setShowComponent("cart");
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
      {showComponent === "cart" && (
        <div>
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
                <div className={style.selfPickup}>
                  <CheckboxField
                    checked={selfPickup}
                    onChange={(e) => dispatch(setSelfPickup(e.target.checked))}
                  />
                  <lable>Self PickUp</lable>
                </div>
                {/* <div>
                  <CouponCode />
                </div> */}
              </div>
              <OrderSummary
                total={total}
                discount={discount}
                isLoading={isLoading}
                discountPercentage={discountPercentage}
                payNow={payNow}
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
      )}

      {showComponent === "payment" && (
        <div>
          <PaymentCard handleCancel={handleCancel} />
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
