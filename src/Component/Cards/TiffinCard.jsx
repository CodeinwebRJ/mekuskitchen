import style from "../../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../Buttons/AddToCartButton";
import DateChip from "../Buttons/DateChip";
import { useSelector, useDispatch } from "react-redux";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import slugify from "../../Utils/URLslug";
import { getDatesForDayInRange } from "../../Utils/DateDayRange";
import { useEffect, useState } from "react";

const TiffinCard = ({ item }) => {
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);
  const [validDates, setValidDates] = useState([]);

  useEffect(() => {
    if (item?.date && item?.endDate && item?.day) {
      const matchingDates = getDatesForDayInRange(
        item.date,
        item.endDate,
        item.day
      );
      setValidDates(matchingDates);
    }
  }, [item]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      const localCartData = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        tiffins: [],
      };

      const localCartItems = localCartData.items || [];
      const localCartTiffin = localCartData.tiffins || [];

      if (localCartItems.length > 0) {
        Toast({
          message: "Tiffin is already added to cart!",
          type: "error",
        });
        return;
      }

      const exists = localCartTiffin.find((items) => items._id === item._id);

      if (exists) {
        const updatedTiffin = localCartTiffin.map((items) => {
          if (items._id === item._id) {
            return { ...items, quantity: items.quantity + 1 };
          }
          return items;
        });

        const updatedCart = {
          items: localCartItems,
          tiffins: updatedTiffin,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({
          message: "Tiffin quantity updated in cart!",
          type: "success",
        });
        dispatch(setCart(updatedCart));
      } else {
        const updatedTiffin = [
          ...localCartTiffin,
          { ...item, quantity: 1, price: item.price },
        ];

        const updatedCart = {
          items: localCartItems,
          tiffins: updatedTiffin,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        Toast({
          message: "Tiffin added to cart!",
          type: "success",
        });
        dispatch(setCart(updatedCart));
      }

      return;
    }

    if (Cart?.items?.items?.length > 0) {
      Toast({
        message: "Tiffin is already added to cart!",
        type: "error",
      });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: item._id,
        customizedItems: item.items || [],
        specialInstructions: item.specialInstructions || "",
        orderDate: Date.now(),
        day: item.day,
        quantity: 1,
        price: item.subTotal,
      });
      dispatch(setCart(res.data.data));
      Toast({
        message: "Tiffin added to cart successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({
        message: "Something went wrong!",
        type: "error",
      });
    }
  };

  return (
    <div className={style.tiffinCard}>
      <Link
        to={`/product/tiffin/${slugify(item.day)}`}
        state={{ id: item._id }}
      >
        <div className={style.tiffinImgContainer}>
          <img
            src={item?.image_url?.[0].url || ""}
            alt={item?.day || "Tiffin"}
            className={style.tiffinImg}
          />
          {item?.date && <DateChip name={validDates[0]} />}
        </div>

        {item?.day && <p className={style.tiffinTitle}>{item.day}</p>}
        {item?.subTotal && (
          <p className={style.price}>${Number(item.totalAmount).toFixed(2)}</p>
        )}
      </Link>
      <AddToCartButton onclick={handleAddToCart} />
    </div>
  );
};

export default TiffinCard;
