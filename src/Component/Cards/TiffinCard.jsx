import React from "react";
import style from "../../styles/TiffinCard.module.css";
import { Link } from "react-router-dom";
import AddToCartButton from "../Buttons/AddToCartButton";
import { formatDate } from "../../Utils/FormateDate";
import DateChip from "../Buttons/DateChip";

const TiffinCard = (props) => {
  const { item } = props;
  const handleAddToCart = async () => {
    if (!user) return;
    if (Cart?.items?.items.length > 0) {
      Toast({
        message: "Product is already added to cart!",
        type: "error",
      });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity: 1,
        price: product.price,
      });
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error adding to cart:", error);
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
            src={item?.image_url[0] || ""}
            alt={item?.day}
            className={style.tiffinImg}
          />

          {/* Date */}
          {item?.date && <DateChip name={formatDate(item?.date)} />}
        </div>

        {/* Title */}
        {item?.day && <p className={style.tiffinTitle}>{item?.day}</p>}

        {/* Price */}
        {item?.subTotal && (
          <p className="price">${Number(item?.subTotal).toFixed(2)}</p>
        )}
      </Link>
      <AddToCartButton onclick={() => handleAddToCart()} />
    </div>
  );
};

export default TiffinCard;
