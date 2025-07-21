import style from "../../styles/TiffinCard.module.css";
import { Link, useNavigate } from "react-router-dom";
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

  const areItemsEqual = (items1, items2) => {
    if (items1.length !== items2.length) return false;

    const normalize = (items) =>
      items
        .map((i) => ({
          id: i._id || i.itemId,
          quantity: parseInt(i.quantity || 1),
        }))
        .sort((a, b) => a.id.localeCompare(b.id));

    const normalized1 = normalize(items1);
    const normalized2 = normalize(items2);

    return normalized1.every((item, i) => {
      return (
        item.id === normalized2[i].id &&
        item.quantity === normalized2[i].quantity
      );
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      const localCartData = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        tiffins: [],
      };
      const localCartItems = localCartData.items || [];
      const localCartTiffins = localCartData.tiffins || [];

      if (localCartItems.length > 0) {
        Toast({ message: "Cart already contains items.", type: "error" });
        return;
      }

      const orderDate = new Date().toISOString().split("T")[0];

      const customizedItems =
        (item.items || []).map((i) => ({
          _id: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
          weight: i.weight || "",
          weightUnit: i.weightUnit || "",
          description: i.description || "",
        })) || [];

      const tiffinData = {
        _id: item._id,
        tiffinMenuId: item._id,
        name: item.name,
        image_url: item.image_url,
        day: item.day,
        deliveryDate: item.date,
        isCustomized: false,
        customizedItems,
        quantity: 1,
        price: item.totalAmount,
        specialInstructions: item.specialInstructions || "No onions",
        orderDate,
      };

      const existingIndex = localCartTiffins.findIndex(
        (t) =>
          t.tiffinMenuId === item._id &&
          areItemsEqual(t.customizedItems || [], customizedItems)
      );

      let updatedTiffins;

      if (existingIndex !== -1) {
        updatedTiffins = localCartTiffins.map((tiffin, index) => {
          if (index === existingIndex) {
            return {
              ...tiffin,
              quantity: tiffin.quantity + 1,
              price: parseFloat(tiffin.price || 0).toFixed(2),
            };
          }
          return tiffin;
        });
        Toast({ message: "Tiffin quantity updated in cart!", type: "success" });
      } else {
        updatedTiffins = [...localCartTiffins, tiffinData];
        Toast({ message: "Tiffin added to cart!", type: "success" });
      }

      const updatedCart = {
        items: localCartItems,
        tiffins: updatedTiffins,
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
      return;
    }

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

  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/product/tiffin/${slugify(item.day)}`);
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
      {isRegular ? (
        <AddToCartButton
          onclick={handleAddToCart}
          disabled={isExpired ? true : false}
        />
      ) : (
        <button
          className="Button sm"
          onClick={handleView}
          disabled={isExpired ? true : false}
        >
          VIEW TIFFIN
        </button>
      )}
    </div>
  );
};

export default TiffinCard;
