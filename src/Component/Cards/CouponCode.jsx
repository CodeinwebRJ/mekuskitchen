import { useState } from "react";
import style from "../../styles/CouponCode.module.css";
import Button from "../Buttons/Button";

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
      <h4 className={style.couponTitle}>Apply Coupon</h4>
      <div className={style.couponRow}>
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          className={style.couponInput}
          onChange={(e) => setCoupon(e.target.value)}
          disabled={isLoading || appliedCoupon}
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
