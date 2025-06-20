import { useState } from "react";
import style from "../../styles/CouponCode.module.css";
import InputField from "../UI-Components/InputField";
import { RiCoupon3Fill } from "react-icons/ri";

const CouponCode = ({ onApply, isLoading, appliedCoupon }) => {
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!coupon.trim()) {
      setError("Please enter a valid coupon code.");
      return;
    }
    setError("");
    onApply(coupon);
  };

  return (
    <div className={style.applyCouponContainer}>
      <h6 className={style.couponTitle}>Apply Coupon</h6>
      <div className={style.couponRow}>
        <InputField
          type="text"
          placeholder="Apply Coupon"
          value={coupon}
          className={style.couponInput}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={isLoading || appliedCoupon}
          icon={<RiCoupon3Fill />}
        />
        <button
          type="button"
          size="sm"
          onClick={handleApply}
          disabled={isLoading || appliedCoupon}
          className={style.CouponButton}
        >
          {appliedCoupon ? "Applied" : isLoading ? "Applying..." : "Apply"}
        </button>
      </div>
      {error && <p className={style.couponError}>{error}</p>}
    </div>
  );
};

export default CouponCode;
