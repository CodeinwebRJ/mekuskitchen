import { useEffect, useRef } from "react";
import style from "../../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import Button from "../Buttons/Button";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Toast } from "../../Utils/Toast";
import { setCartCount } from "../../../Store/Slice/CountSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleDelete = async (id, type, dayName = null, skuId) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {
        Tiffin: [],
        items: [],
      };
      let updatedTiffin = localCart.Tiffin;
      let updatedItems = localCart.items;

      if (localCart.items.length > 0) {
        updatedItems = localCart.items.filter((item) => item._id !== id);
      } else if (localCart.Tiffin.length > 0) {
        updatedTiffin = localCart.Tiffin.filter((item) => item._id !== id);
      }

      const updatedCart = {
        Tiffin: updatedTiffin,
        items: updatedItems,
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      Toast({ message: "Removed from cart!", type: "success" });
      dispatch(setCart(updatedCart));
      dispatch(setCartCount(updatedTiffin.length + updatedItems.length));
      return;
    } else {
      try {
        const data = {
          user_id: user?.userid,
          type,
          quantity: 0,
          skuId: skuId ? skuId : undefined,
          product_id: type === "product" ? id : undefined,
          tiffinMenuId: type === "tiffin" ? id : undefined,
          day: type === "tiffin" ? dayName : undefined,
        };
        const res = await UpdateUserCart(data);
        dispatch(setCart(res.data.data));
      } catch (error) {
        console.error("Error deleting item from cart", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const calculateSubtotal = () => {
    let productItems = [];
    if (Array.isArray(Cart?.items)) {
      productItems = Cart.items;
    } else if (Array.isArray(Cart?.items?.items)) {
      productItems = Cart.items.items;
    }
    const productTotal = productItems.reduce(
      (acc, item) => acc + (item?.sellingPrice || 0) * (item?.quantity || 1),
      0
    );

    return productTotal.toFixed(2);
  };

  return (
    <>
      {isOpen && <div className={style.backdrop} onClick={onClose}></div>}
      <div
        className={`${style.sidebar} ${isOpen ? style.open : ""}`}
        ref={sidebarRef}
      >
        <div className={style.closeBtn}>
          <h5>SHOPPING CART</h5>
          <FaTimes size={20} onClick={onClose} />
        </div>

        {Cart?.items?.items?.length > 0 && (
          <div className={style.cartContainer}>
            {Cart.items.items.map((item, index) => (
              <div className={style.cartItem} key={item._id || index}>
                <div className={style.cartItemImageContainer}>
                  <img
                    src={
                      isAuthenticated
                        ? item?.sku?.images?.[0] ||
                          item?.productDetails?.images?.[0]?.url ||
                          "/defaultImage.png"
                        : item?.sku[0]?.SKUImages?.[0] ||
                          item?.images?.[0]?.url ||
                          "/defaultImage.png"
                    }
                    alt={
                      item?.sku?.name ||
                      item?.productDetails?.name ||
                      "Cart item"
                    }
                    className={style.cartItemImage}
                  />
                </div>
                <div className={style.cartItemDetails}>
                  <div>
                    <p className={style.cartItemName}>
                      {isAuthenticated
                        ? (
                            item?.sku?.name ||
                            item?.productDetails?.name ||
                            "Item"
                          ).toUpperCase()
                        : (
                            item?.sku[0]?.details?.Name ||
                            item?.name ||
                            "Item"
                          ).toUpperCase()}
                    </p>
                    <p className={style.cartItemCalculation}>
                      <span className={style.quantity}>{item.quantity}</span>
                      <span className={style.multiply}>×</span>
                      <span className={style.price}>
                        $
                        {item.sellingPrice ||
                          item?.productDetails?.sellingPrice ||
                          0}
                      </span>
                    </p>
                  </div>
                  <div
                    className={style.deleteButton}
                    onClick={() =>
                      handleDelete(
                        isAuthenticated ? item.product_id : item._id,
                        "product",
                        null,
                        item?.sku?.skuId
                      )
                    }
                  >
                    <BsTrash className={style.deleteIcon} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Cart?.items?.tiffins?.length > 0 && (
          <div className={style.cartContainer}>
            {Cart.items.tiffins.map((item, index) => (
              <div className={style.cartItem} key={item._id || index}>
                <div className={style.cartItemImageContainer}>
                  <img
                    src={
                      item.tiffinMenuDetails?.image_url?.[0]?.url ||
                      "/defaultImage.png"
                    }
                    alt={item.day || "Tiffin item"}
                    className={style.cartItemImage}
                  />
                </div>
                <div className={style.cartItemDetails}>
                  <div>
                    <p className={style.cartItemName}>
                      {(item?.day || "Tiffin Item").toUpperCase()}
                    </p>
                    <p className={style.cartItemCalculation}>
                      <span className={style.quantity}>{item.quantity}</span>
                      <span className={style.multiply}>×</span>
                      <span className={style.price}>
                        ${item.totalAmount || 0}
                      </span>
                    </p>
                  </div>
                  <div
                    className={style.deleteButton}
                    onClick={() =>
                      handleDelete(item.tiffinMenuId, "tiffin", item.day)
                    }
                  >
                    <BsTrash className={style.deleteIcon} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isAuthenticated ? (
          !Cart.items?.items?.length && !Cart?.items?.tiffins?.length ? (
            <div className={style.cartContainer}>
              <div className={style.emptyCartText}>
                <h5>Your Cart Is Empty</h5>
              </div>
            </div>
          ) : null
        ) : Cart?.items?.length === 0 ? (
          <div className={style.cartContainer}>
            <div className={style.emptyCartText}>
              <h5>Your Cart Is Empty</h5>
            </div>
          </div>
        ) : null}

        <div className={style.cartItemSubtotal}>
          <div className={style.subtotalContainer}>
            <h5 className={style.subtotalText}>SUBTOTAL:</h5>
            <h5 className="price">
              ${isAuthenticated ? Cart.items.totalAmount : calculateSubtotal()}
            </h5>
          </div>
          <div className={style.subtotalButtons}>
            <div className={style.viewCart}>
              <Button
                onClick={() => navigate("/cart")}
                variant="light"
                size="sm"
              >
                VIEW CART
              </Button>
            </div>
            <Button
              onClick={() => navigate("/checkout")}
              variant="primary"
              size="sm"
            >
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
