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
  ShippingCharges,
} from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
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
  SCV,
  SCC,
  discountPercentage,
  tax,
  federalTax,
  provinceTax,
  payNow,
  isLoading,
}) => (
  <div className={style.cartTotals}>
    <h3 className={style.cartTitle}>Billing Summary</h3>
    <hr />
    <div className={style.totalContainer}>
      <div className={style.total}>
        <span>Subtotal</span>
        <span>${total.toFixed(2) || 0} CAD</span>
      </div>

      {discount > 0 && (
        <div className={`${style.total} ${style.discount}`}>
          <span>Discount</span>
          <span>
            -${discount.toFixed(2) || 0} CAD ({discountPercentage.toFixed(2)}%)
          </span>
        </div>
      )}

      <div className={style.total}>
        <span>Shipping charges</span>
        <span>
          ${SCV} {SCC || "CAD"}
        </span>
      </div>
      <div className={style.total}>
        <span>Province Tax</span>
        <span>${Number(provinceTax).toFixed(2) || 0} CAD</span>
      </div>
      <div className={style.total}>
        <span>Federal Tax</span>
        <span>${Number(federalTax).toFixed(2) || 0} CAD</span>
      </div>
      <div className={style.total}>
        <span>Total Tax</span>
        <span>${Number(tax).toFixed(2)} CAD</span>
      </div>
    </div>
    <hr />
    <div className={`${style.total} ${style.grandTotal}`}>
      <span>Total</span>
      <p>${(Number(total) + Number(tax)).toFixed(2)} CAD</p>
    </div>

    <div className={style.checkoutButton}>
      <button disabled={isLoading} onClick={payNow} className="Button md">
        {isLoading ? "Processing..." : "Checkout"}
      </button>
    </div>
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
  const [shippingCharges, setShippingCharges] = useState(null);

  const payNow = () => {
    setShowComponent("payment");
  };

  const handleCancel = () => {
    setShowComponent("cart");
  };

  const fetchUserCart = async () => {
    try {
      const userId = user?.userid;
      const provinceCode = defaultAddress?.billing?.provinceCode;

      if (!userId) {
        console.error("User ID is missing");
        return;
      }
      if (!provinceCode) {
        console.error("Province code is missing");
        return;
      }

      const data = {
        id: userId,
        provinceCode,
      };

      const res = await getUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error fetching user cart:", error);
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
    if (user?.userid && defaultAddress?.billing?.postCode) {
      fetchUserCart();
    }
  }, [user?.userid, defaultAddress?.billing?.postCode]);

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

  const fetchShipping = async () => {
    try {
      const data = {
        shipTo: {
          name: defaultAddress.billing.name,
          phone: defaultAddress.billing.phone,
          address: {
            addressLine: [defaultAddress.billing.address],
            city: defaultAddress.billing.city,
            postalCode: defaultAddress.billing.postCode,
            stateOrProvince: defaultAddress.billing.provinceCode,
            countryCode: defaultAddress.billing.countryCode,
          },
        },
        packages: cart?.items?.items?.map((item) => ({
          unit: String(item.productDetails.weightUnit),
          weight: String(item.productDetails.weight),
          quantity: String(item.quantity),
        })),
      };
      const res = await ShippingCharges(data);
      setShippingCharges(res.data.data);
    } catch (error) {
      console.error("Error fetching shipping:", error);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, [defaultAddress, cart]);

  const SCV =
    shippingCharges?.ShipmentResponse?.ShipmentResults?.ShipmentCharges
      ?.TotalCharges?.MonetaryValue;

  const SCC =
    shippingCharges?.ShipmentResponse?.ShipmentResults?.ShipmentCharges
      ?.TotalCharges?.CurrencyCode;

  return (
    <div className={style.mainContainer}>
      {showComponent === "cart" && (
        <div>
          <Header />
          <Banner name="Checkout" path="/cart" />
          <div className={style.checkoutContainer}>
            <>
              <OrderSummary
                total={total}
                discount={discount}
                isLoading={isLoading}
                discountPercentage={discountPercentage}
                payNow={payNow}
                federalTax={cart?.items?.totalFederalTax}
                provinceTax={cart?.items?.totalProvinceTax}
                tax={cart?.items?.totalTax}
                SCV={SCV}
                SCC={SCC}
              />
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
              </div>
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
