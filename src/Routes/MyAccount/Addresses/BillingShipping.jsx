import style from "../../../styles/Billing.module.css";
import { useSelector } from "react-redux";

const BillingShipping = () => {
  const { defaultAddress } = useSelector((state) => state.address);

  return (
    <div className={style.addressContainer}>
      {/* Billing Address */}
      <div className={style.billingAddressContainer}>
        <div className={style.addressTitle}>BILLING ADDRESS</div>

        {defaultAddress?.billing ? (
          <div className={`${style.addressCardContainer}`}>
            <div className={style.addressCard}>
              <h1 className={style.fullName}>
                {defaultAddress?.billing?.name}
              </h1>

              <p className={style.address}>{defaultAddress?.address}</p>

              <p className={style.cityState}>
                {defaultAddress?.billing?.city} -{" "}
                {defaultAddress?.billing?.state}
              </p>

              <p className={style.CountryPostcode}>
                {defaultAddress?.billing?.country} -{" "}
                {defaultAddress?.billing?.postCode}
              </p>

              <p className={style.phoneNumber}>
                Phone: {defaultAddress?.billing?.phone}
              </p>
            </div>
          </div>
        ) : (
          <p className={style.addressNotFoundMessage}>
            You have not set up this type of address yet.
          </p>
        )}
      </div>

      {/* Shipping Address */}
      {defaultAddress?.shipping && (
        <div className={style.shippingAddressContainer}>
          <div className={style.addressTitle}>SHIPPING ADDRESS</div>

          <div className={`${style.addressCardContainer}`}>
            <div className={style.addressCard}>
              <h1 className={style.fullName}>
                {defaultAddress?.shipping?.name}
              </h1>

              <p className={style.address}>{defaultAddress?.address}</p>

              <p className={style.cityState}>
                {defaultAddress?.shipping?.city} -{" "}
                {defaultAddress?.shipping?.state}
              </p>

              <p className={style.CountryPostcode}>
                {defaultAddress?.shipping?.country} -{" "}
                {defaultAddress?.shipping?.postCode}
              </p>

              <p className={style.phoneNumber}>
                Phone: {defaultAddress?.shipping?.phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingShipping;
