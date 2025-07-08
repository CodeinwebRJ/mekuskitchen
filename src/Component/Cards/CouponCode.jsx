import { useState } from "react";
import style from "../../styles/CouponCode.module.css";
import InputField from "../UI-Components/InputField";
import { RiCoupon3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart, validateCoupon } from "../../axiosConfig/AxiosConfig";
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
      const data = {
        id: user.userid,
      };
      const res = await getUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error fetching user cart", error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setError("Coupon code is required");
      return;
    }

    setError("");
    try {
      const items = cart?.items || [];
      const categories = items?.items
        ?.map((item) =>
          isAuthenticated ? item?.productDetails?.category : item?.category
        )
        .filter(Boolean);

      const subCategories = items?.items
        ?.map((item) =>
          isAuthenticated
            ? item?.productDetails?.subCategory
            : item?.subCategory
        )
        .filter(Boolean);

      const productCategories = items?.items
        ?.map((item) =>
          isAuthenticated
            ? item?.productDetails?.ProductCategory
            : item?.ProductCategory
        )
        .filter(Boolean);

      const category = [...new Set(categories)].join(",");
      const subCategory = [...new Set(subCategories)].join(",");
      const ProductCategory = [...new Set(productCategories)].join(",");

      const orderTotal = items.totalAmount;

      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(
        2,
        "0"
      )}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${today.getFullYear()}`;

      const data = {
        userId: user.userid,
        code: coupon,
        orderTotal,
        date: formattedDate,
        category,
        subCategory,
        ProductCategory,
      };

      const res = await validateCoupon(data);
      setDiscount(res?.data?.data);
      if (res?.data?.statusCode === 200) {
        fetchUserCart();
      }
      Toast({
        message: res?.data?.message || "Coupon applied!",
        type: "success",
      });
    } catch (error) {
      console.log("Coupon validation failed", error);
      Toast({ message: "Failed to apply coupon", type: "error" });
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

        {data?.items?.couponCode && (
          <div className={style.appliedCouponBox}>
            <div className={style.appliedCouponDetails}>
              <p>{data?.items?.couponCode}</p>
              <p>
                {data?.items?.discountValue}{" "}
                {data.items.discountType === "percentage" ? "%" : "CAD"}
              </p>
            </div>
            <button className={style.removeBtn}>Remove</button>
          </div>
        )}

        <button
          onClick={handleApplyCoupon}
          className="Button sm"
          disabled={!coupon.trim()}
        >
          {isLoading ? "Applying..." : "Apply"}
        </button>
      </div>
      {error && <p className={style.couponError}>{error}</p>}
    </div>
  );
};

export default CouponCode;
