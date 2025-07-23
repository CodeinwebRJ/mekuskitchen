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
import Loading from "../../Component/UI-Components/Loading";

const OrderSummary = ({
  total,
  discount,
  SCV,
  SCC,
  selfPickup,
  discountPercentage,
  tax,
  federalTax,
  provinceTax,
  payNow,
  isLoading,
  hasTiffin,
}) => {
  const safeNumber = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const subtotal = safeNumber(total);
  const discountValue = safeNumber(discount);
  const discountPercent = safeNumber(discountPercentage);
  const provinceTaxValue = safeNumber(provinceTax);
  const federalTaxValue = safeNumber(federalTax);
  const totalTax = safeNumber(tax);

  const extraShipping = !selfPickup && subtotal < 12 ? 3 : 0;
  const shippingChargeValue = selfPickup
    ? 0
    : subtotal < 12
    ? extraShipping
    : safeNumber(SCV);

  const grandTotal = (subtotal + totalTax + shippingChargeValue).toFixed(2);

  return (
    <div className={style.cartTotals}>
      <h3 className={style.cartTitle}>Billing Summary</h3>
      <hr />
      <div className={style.totalContainer}>
        <div className={style.total}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)} CAD</span>
        </div>

        {discountValue > 0 && (
          <div className={`${style.total} ${style.discount}`}>
            <span>Discount</span>
            <span>
              -${discountValue.toFixed(2)} CAD ({discountPercent.toFixed(2)}%)
            </span>
          </div>
        )}

        {!selfPickup && (
          <div className={style.total}>
            <span>Shipping charges</span>
            <span>
              ${shippingChargeValue.toFixed(2)} {SCC || "CAD"}
            </span>
          </div>
        )}
        <>
          <div className={style.total}>
            <span>Province Tax</span>
            <span>${provinceTaxValue.toFixed(2)} CAD</span>
          </div>
          <div className={style.total}>
            <span>Federal Tax</span>
            <span>${federalTaxValue.toFixed(2)} CAD</span>
          </div>
          <div className={style.total}>
            <span>Total Tax</span>
            <span>${totalTax.toFixed(2)} CAD</span>
          </div>
        </>
      </div>
      <hr />
      <div className={`${style.total} ${style.grandTotal}`}>
        <span>Total</span>
        <p>${grandTotal} CAD</p>
      </div>

      <div className={style.checkoutButton}>
        <button disabled={isLoading} onClick={payNow} className="Button md">
          {isLoading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { defaultAddress, addresses, selfPickup } = useSelector(
    (state) => state.address
  );
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [dialog, setDialog] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showComponent, setShowComponent] = useState("cart");
  const [shippingCharges, setShippingCharges] = useState(null);
  const [addressError, setAddressError] = useState("");

  const payNow = () => {
    if (!defaultAddress) {
      setAddressError(
        "Please select or add a delivery address before checkout."
      );
      const addressSection = document.getElementById("address-section");
      if (addressSection) {
        addressSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setAddressError("");
    setShowComponent("payment");
  };

  const handleCancel = () => {
    setShowComponent("cart");
  };

  const fetchUserCart = async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    } finally {
      setIsLoading(false);
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
    fetchUserCart();
  }, [
    user?.userid,
    defaultAddress?.billing?.postCode,
    cart?.items?.length,
    cart?.tiffin?.length,
  ]);

  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const response = await getUserAddress(user.userid);
      if (response.status === 200) {
        const data = response?.data?.data || [];
        dispatch(setAddresses(data));
        const activeAddress = data.find((addr) => addr.isActive);
        if (activeAddress) dispatch(setDefaultAddress(activeAddress));
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
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
          name: defaultAddress.shipping
            ? defaultAddress.shipping.name
            : defaultAddress.billing.name,
          phone: defaultAddress.shipping
            ? defaultAddress.shipping.phone
            : defaultAddress.billing.phone,
          address: {
            addressLine: [
              defaultAddress.shipping
                ? defaultAddress.shipping.address
                : defaultAddress.billing.address,
            ],
            city: defaultAddress.shipping
              ? defaultAddress.shipping.city
              : defaultAddress.billing.city,
            postalCode: defaultAddress.billing.postCode,
            stateOrProvince: defaultAddress.shipping
              ? defaultAddress.shipping.provinceCode
              : defaultAddress.billing.provinceCode,
            countryCode: defaultAddress.shipping
              ? defaultAddress.shipping.countryCode
              : defaultAddress.billing.countryCode,
          },
        },
        packages: cart?.items?.items?.map((item) => ({
          unit: String(item.productDetails.weightUnit),
          weight: String(item.productDetails.weight),
          quantity: String(item.quantity),
        })),
        RequestOption: "Rate",
      };
      const res = await ShippingCharges(data);
      setShippingCharges(res.data.data);
    } catch (error) {
      console.error("Error fetching shipping:", error);
    }
  };

  useEffect(() => {
    if (defaultAddress && cart?.items?.items?.length > 0) {
      fetchShipping();
    }
  }, [defaultAddress, cart.items?.items]);

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
          {isLoading ? (
            <Loading />
          ) : (
            <div className={style.checkoutContainer}>
              <>
                <OrderSummary
                  total={cart?.items?.grandTotal}
                  discount={discount}
                  isLoading={isLoading}
                  discountPercentage={discountPercentage}
                  payNow={payNow}
                  federalTax={cart?.items?.totalFederalTax}
                  provinceTax={cart?.items?.totalProvinceTax}
                  tax={cart?.items?.totalTax}
                  selfPickup={selfPickup}
                  SCV={SCV}
                  SCC={SCC}
                  hasTiffin={cart?.items?.tiffins?.length > 0}
                />
                <div className={style.address}>
                  <div className={style.addressContainer}>
                    {addresses.length < 3 ? (
                      <AddAddressCard
                        onClick={() => {
                          dispatch(setShowAddressForm(true));
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
                      onChange={(e) =>
                        dispatch(setSelfPickup(e.target.checked))
                      }
                    />
                    <lable>Self PickUp</lable>
                  </div>
                  {addressError && (
                    <div className={style.error}>{addressError}</div>
                  )}
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
          )}
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
