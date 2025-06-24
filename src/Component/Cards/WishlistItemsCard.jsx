import style from "../../styles/WishlistItem.module.css";
import RatingStar from "../RatingStar";
import { RiShareLine } from "react-icons/ri";
import { AddtoCart, RemoveWishlist } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "../../Utils/Toast";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice";
import { setWishlistCount } from "../../../Store/Slice/CountSlice";
import { Link } from "react-router-dom";
import { BsTrash } from "react-icons/bs";

const WishlistItem = ({ product, fetchWishlist }) => {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;

    if (cartItems?.tiffins?.length > 0) {
      return Toast({
        message: "Tiffin is already added to cart!",
        type: "error",
      });
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: _id,
        quantity: 1,
        price,
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product to cart.", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      const localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = localWishlist.some((item) => item._id === product._id);

      if (exists) {
        const updatedWishlist = localWishlist.filter(
          (item) => item._id !== product._id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        dispatch(setWishlist(updatedWishlist));
        dispatch(setWishlistCount(updatedWishlist.length));
        Toast({ message: "Removed from wishlist!", type: "success" });
      }
      return;
    }
    try {
      await RemoveWishlist({ userid: user.userid, productId: product._id });
      Toast({ message: "Item removed from wishlist.", type: "success" });
      fetchWishlist();
    } catch (error) {
      console.error("Error deleting item from wishlist", error);
      Toast({ message: "Failed to remove from wishlist.", type: "error" });
    }
  };

  return (
    <div className={style.item}>
      <div className={style.itemLeftSide}>
        <div className={style.itemImage}>
          <img
            src={product.images?.[0]?.url || "defaultImage.png"}
            alt={product.name || "wishlist item"}
          />
        </div>
        <div className={style.itemContent}>
          <Link
            to={`/product/${product.category.toLowerCase()}/${product.name.toLowerCase()}`}
            state={{ id: product._id }}
          >
            <span className={style.itemName}>
              {product.name?.toUpperCase()}
            </span>
          </Link>
          <div className={style.itemPrice}>
            <span className="originalPrice">${product.price}</span>
            <span className="price">${product.sellingPrice} CAD</span>
          </div>
          <span className={style.itemDescription}>{product.description}</span>
        </div>
      </div>

      <div className={style.itemRightSide}>
        <div className={style.stockContainer}>
          <span className={style.stockTitle}>In Stock</span>
          <RatingStar start={0} stop={5} rating={3} disabled />
          <div className={style.controllers}>
            <RiShareLine className={style.icon} />
            <BsTrash onClick={handleDelete} className={style.icon} />
          </div>
        </div>

        <button className="Button sm" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
