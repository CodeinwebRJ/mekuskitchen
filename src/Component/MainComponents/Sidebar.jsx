import React, { useEffect, useRef, useCallback, useMemo } from "react";
import style from "../../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { setCartCount } from "../../../Store/Slice/CountSlice";
import { UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import Loading from "../UI-Components/Loading";
import NoDataFound from "./NoDataFound";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleDelete = useCallback(
    async (id, type, dayName = null, skuId) => {
      setIsLoading(true);
      try {
        if (!isAuthenticated) {
          const localCart = JSON.parse(localStorage.getItem("cart")) || {
            tiffins: [],
            items: [],
          };

          const updatedCart = {
            tiffins: localCart.tiffins.filter((item) => item._id !== id),
            items: localCart.items.filter((item) => item._id !== id),
          };

          localStorage.setItem("cart", JSON.stringify(updatedCart));
          dispatch(setCart(updatedCart));
          dispatch(
            setCartCount(updatedCart.tiffins.length + updatedCart.items.length)
          );
          Toast({ message: "Removed from cart!", type: "success" });
        } else {
          const data = {
            user_id: user?.userid,
            type,
            quantity: 0,
            skuId: skuId ?? undefined,
            product_id: type === "product" ? id : undefined,
            tiffinMenuId: type === "tiffin" ? id : undefined,
            day: type === "tiffin" ? dayName : undefined,
          };

          const res = await UpdateUserCart(data);
          dispatch(setCart(res.data.data));
          Toast({ message: "Removed from cart!", type: "success" });
        }
      } catch (error) {
        console.error("Error deleting item from cart", error);
        Toast({ message: "Failed to remove item from cart", type: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, dispatch]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const calculateSubtotal = useMemo(() => {
    const productItems = cart?.items?.items || [];
    const tiffinItems = cart?.items?.tiffins || [];

    const productTotal = productItems?.reduce(
      (acc, item) =>
        acc +
        (item?.sku?.details?.combinations?.Price || item?.sellingPrice || 0) *
          (item?.quantity || 1),
      0
    );
    const tiffinTotal = tiffinItems.reduce(
      (acc, item) =>
        acc +
        (isAuthenticated
          ? item?.tiffinMenuDetails?.totalAmount
          : item?.totalAmount || 0) *
          (item?.quantity || 1),
      0
    );

    return (productTotal + tiffinTotal).toFixed(2);
  }, [cart, isAuthenticated]);

  const renderCartItem = (item, index, type) => {
    return (
      <div className={style.cartItem} key={item?._id || index}>
        <div className={style.cartItemImageContainer}>
          <img
            src={
              type === "product"
                ? isAuthenticated
                  ? item?.sku?.images?.[0] ||
                    item?.productDetails?.images?.[0]?.url ||
                    "/defaultImage.png"
                  : (item.sku && item?.sku[0]?.SKUImages?.[0]) ||
                    item?.images?.[0]?.url ||
                    "/defaultImage.png"
                : isAuthenticated
                ? item?.tiffinMenuDetails?.image_url?.[0]?.url ||
                  "/defaultImage.png"
                : item?.image_url?.[0]?.url || "/defaultImage.png"
            }
            alt={
              type === "product"
                ? item?.sku?.name || item?.productDetails?.name || "Item"
                : item?.day || "Tiffin Item"
            }
            className={style.cartItemImage}
          />
        </div>
        <div className={style.cartItemDetails}>
          <div>
            <p className={style.cartItemName}>
              {type === "product"
                ? isAuthenticated
                  ? item?.sku?.name || item?.productDetails?.name
                  : (item.sku && item?.sku[0]?.details?.Name) ||
                    item?.name ||
                    "Item"
                : (item?.day || "Tiffin Item").toUpperCase()}
            </p>
            <p className={style.cartItemCalculation}>
              <span className={style.quantity}>{item.quantity}</span>
              <span className={style.multiply}>×</span>
              <span className={style.price}>
                $
                {type === "product"
                  ? isAuthenticated
                    ? item.price || item?.productDetails?.sellingPrice || 0
                    : item?.sku?.details?.combinations?.Price ||
                      item?.price ||
                      0
                  : item.totalAmount || 0}{" "}
                {item?.productDetails?.currency || "CAD"}
              </span>
            </p>
          </div>
          <div
            className={style.deleteButton}
            onClick={() =>
              handleDelete(
                isAuthenticated
                  ? type === "product"
                    ? item.product_id
                    : item.tiffinMenuId
                  : item._id,
                type,
                type === "tiffin" ? item.day : null,
                type === "product" ? item?.sku?.skuId : undefined
              )
            }
          >
            <BsTrash className={style.deleteIcon} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className={style.backdrop} onClick={onClose} />}
      <div
        className={`${style.sidebar} ${isOpen ? style.open : ""}`}
        ref={sidebarRef}
      >
        <div className={style.closeBtn}>
          <h5>SHOPPING CART</h5>
          <FaTimes size={20} onClick={onClose} />
        </div>

        {cart?.items?.items?.length > 0 || cart?.items?.tiffins?.length > 0 ? (
          <div className={style.cartContainer}>
            {isLoading && (
              <div className={style.loading}>
                <Loading />
              </div>
            )}
            {cart?.items?.items?.map((item, index) =>
              renderCartItem(item, index, "product")
            )}
            {cart?.items?.tiffins?.map((item, index) =>
              renderCartItem(item, index, "tiffin")
            )}
          </div>
        ) : (
          <div className={style.cartContainer}>
            <NoDataFound message="Your cart is empty" />
          </div>
        )}

        <div className={style.cartItemSubtotal}>
          <div className={style.subtotalContainer}>
            <h5 className={style.subtotalText}>SUBTOTAL:</h5>
            <h5 className={style.subtotal}>
              ${isAuthenticated ? cart.items.totalAmount : calculateSubtotal}
            </h5>
          </div>
          <div className={style.subtotalButtons}>
            <button
              className={style.viewCartButton}
              onClick={() => navigate("/cart")}
              disabled={isLoading}
            >
              View Cart
            </button>
            <button
              onClick={() =>
                cart.items.items.length > 0 ||
                (cart.items.tiffin.length > 0 && navigate("/checkout"))
              }
              className="Button sm"
              disabled={isLoading}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
