import style from "../../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../Buttons/AddToCartButton";
import DateChip from "../Buttons/DateChip";
import { useSelector, useDispatch } from "react-redux";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import slugify from "../../Utils/URLslug";
import { formatDate } from "../../Utils/FormateDate";
import RatingStar from "../RatingStar";

const TiffinCard = ({ item, isRegular }) => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);

  const isExpired = (() => {
    if (!item?.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(item.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today;
  })();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      const localCartData = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        tiffins: [],
      };

      const localCartItems = localCartData.items || [];
      const localCartTiffin = localCartData.tiffins || [];

      if (localCartItems.length > 0) {
        Toast({ message: "Cart already contains items.", type: "error" });
        return;
      }

      const exists = localCartTiffin.find((t) => t._id === item._id);

      if (exists) {
        const updatedTiffins = localCartTiffin.map((t) =>
          t._id === item._id ? { ...t, quantity: t.quantity + 1 } : t
        );
        const updatedCart = {
          items: localCartItems,
          tiffins: updatedTiffins,
        };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
        Toast({ message: "Tiffin quantity updated in cart!", type: "success" });
      } else {
        const updatedTiffins = [
          ...localCartTiffin,
          {
            ...item,
            quantity: 1,
            price: item.totalAmount,
          },
        ];
        const updatedCart = {
          items: localCartItems,
          tiffins: updatedTiffins,
        };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
        Toast({ message: "Tiffin added to cart!", type: "success" });
      }

      return;
    }

    // For authenticated users
    if (Cart?.items?.items?.length > 0) {
      Toast({
        message: "Cart already contains items.",
        type: "error",
      });
      return;
    }

    const orderDate = new Date().toISOString().split("T")[0];

    try {
      const payload = {
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: item._id,
        customizedItems: item.items || [],
        specialInstructions: item.specialInstructions || "No onions",
        orderDate,
        day: item.day,
        deliveryDate: item.date,
        quantity: 1,
        price: item.totalAmount,
      };

      const res = await AddtoCart(payload);
      dispatch(setCart(res?.data?.data));
      Toast({ message: "Tiffin added to cart successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding tiffin to cart:", error);
      Toast({ message: "Failed to add tiffin to cart", type: "error" });
    }
  };

  return (
    <div className={style.tiffinCard}>
      <Link
        to={`/product/tiffin/${slugify(item.day)}`}
        state={{ id: item._id, isReg: isRegular === true ? "" : "cust" }}
      >
        <div className={style.tiffinImgContainer}>
          <img
            src={item?.image_url?.[0].url || ""}
            alt={item?.day || "Tiffin"}
            className={style.tiffinImg}
          />
          {item?.date && <DateChip name={formatDate(item?.date)} />}
          {item?.day && <div className={style.dayBadge}>{item.day}</div>}
        </div>

        {item?.name && <span>{item.name}</span>}
        <div className={style.rating}>
          <RatingStar rating={4} disabled />
        </div>
        {item?.subTotal && (
          <p className={style.price}>${Number(item.totalAmount).toFixed(2)}</p>
        )}
      </Link>
      <AddToCartButton
        onclick={handleAddToCart}
        disabled={isExpired ? true : false}
      />
    </div>
  );
};

export default TiffinCard;
