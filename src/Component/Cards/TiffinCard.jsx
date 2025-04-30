import React from "react";
import style from "../../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../Buttons/AddToCartButton";
import { formatDate } from "../../Utils/FormateDate";
import DateChip from "../Buttons/DateChip";
import { useSelector, useDispatch } from "react-redux";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast"; // Update this import path based on your setup
import { setCart } from "../../../Store/Slice/UserCartSlice";

const TiffinCard = ({ item }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);

  const handleAddToCart = async () => {
    if (!user) {
      Toast({
        message: "Please log in to add items to your cart.",
        type: "error",
      });
      return;
    }
    if (Cart?.items?.items.length > 0) {
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
        to={`/product/tiffin/${String(item.day).toLowerCase()}`}
        state={{ id: item._id }}
      >
        <div className={style.tiffinImgContainer}>
          <img
            src={item?.image_url?.[0].url || ""}
            alt={item?.day || "Tiffin"}
            className={style.tiffinImg}
          />
          {item?.date && <DateChip name={formatDate(item?.date)} />}
        </div>

        {item?.day && <p className={style.tiffinTitle}>{item.day}</p>}
        {item?.subTotal && (
          <p className="price">${Number(item.subTotal).toFixed(2)}</p>
        )}
      </Link>
      <AddToCartButton onclick={handleAddToCart} />
    </div>
  );
};

export default TiffinCard;
