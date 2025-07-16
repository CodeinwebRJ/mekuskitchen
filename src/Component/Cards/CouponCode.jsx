import { useState } from "react";
import style from "../../styles/CouponCode.module.css";
import InputField from "../UI-Components/InputField";
import { RiCoupon3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  RemoveCoupon,
  validateCoupon,
  ValidateTiffinCoupon,
} from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import { setCart } from "../../../Store/Slice/UserCartSlice.jsx";

const CouponCode = ({ data, isLoading, setDiscount }) => {
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const fetchUserCart = async () => {
    try {
      const res = await getUserCart({ id: user.userid });
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error fetching user cart", error);
    }
  };

  const formatDate = () => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
  };

  const buildCouponPayload = () => {
    const items = cart?.items || {};
    const productItems = items?.items || [];

    const commonData = {
      userId: user.userid,
      code: coupon,
      orderTotal: items?.totalAmount || 0,
      date: formatDate(),
    };

    if (!productItems.length) {
      return { payload: commonData, isTiffin: true };
    }

    const extractUniqueValues = (key) =>
      [
        ...new Set(
          productItems
            .map((item) =>
              isAuthenticated ? item?.productDetails?.[key] : item?.[key]
            )
            .filter(Boolean)
        ),
      ].join(",");

    return {
      payload: {
        ...commonData,
        category: extractUniqueValues("category"),
        subCategory: extractUniqueValues("subCategory"),
        ProductCategory: extractUniqueValues("ProductCategory"),
      },
      isTiffin: false,
    };
  };

  const handleApplyCoupon = async () => {
    if (!isAuthenticated) return setError("Please login to apply coupon code");
    if (!coupon.trim()) return setError("Coupon code is required");

    setError("");

    try {
      const { payload, isTiffin } = buildCouponPayload();
      const res = isTiffin
        ? await ValidateTiffinCoupon(payload)
        : await validateCoupon(payload);

      const discountData = res?.data?.data;

      if (res?.data?.statusCode === 200) {
        setDiscount(discountData);
        Toast({
          message: res.data.message || "Coupon applied!",
          type: "success",
        });
        fetchUserCart();
      } else {
        throw new Error(res?.data?.message || "Coupon not valid");
      }
    } catch (error) {
      console.error("Coupon validation failed", error);
      Toast({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Coupon validation failed",
        type: "error",
      });
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await RemoveCoupon({ userId: user.userid });
      Toast({ message: "Coupon removed Successfully", type: "success" });
      fetchUserCart();
    } catch (error) {
      console.error("Error removing coupon", error);
      Toast({ message: "Failed to remove coupon", type: "error" });
    }
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
          onChange={(e) => {
            setCoupon(e.target.value);
            if (error) setError("");
          }}
          icon={<RiCoupon3Fill />}
        />
        {error && <p className={style.couponError}>{error}</p>}

        {data?.items?.couponCode && (
          <div className={style.appliedCouponBox}>
            <div className={style.appliedCouponDetails}>
              <RiCoupon3Fill />
              <p>{data.items.couponCode}</p>
              <p>
                ({data.items.discountValue}
                {data.items.discountType === "percentage" ? "%" : " CAD"})
              </p>
            </div>
            <button onClick={handleRemoveCoupon} className={style.removeBtn}>
              Remove
            </button>
          </div>
        )}

        <button
          onClick={handleApplyCoupon}
          className="Button sm"
          disabled={isLoading}
        >
          {isLoading ? "Applying..." : "Apply"}
        </button>
      </div>
    </div>
  );
};

export default CouponCode;
