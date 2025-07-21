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

  const areCustomizedItemsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    return a.every((itemA) =>
      b.some(
        (itemB) =>
          itemA.name === itemB.name &&
          itemA.price === itemB.price &&
          itemA.quantity === itemB.quantity &&
          itemA.included === itemB.included &&
          itemA.weight === itemB.weight &&
          itemA.weightUnit === itemB.weightUnit &&
          itemA.description === itemB.description
      )
    );
  };

  const handleDelete = useCallback(
    async (
      id,
      type,
      day = null,
      customizedItems = [],
      skuId = null,
      combination = null
    ) => {
      setIsLoading(true);
      try {
        if (!isAuthenticated) {
          const localCart = JSON.parse(localStorage.getItem("cart")) || {
            tiffins: [],
            items: [],
          };

          const updatedCart = {
            tiffins:
              type === "tiffin"
                ? localCart.tiffins.filter(
                    (item) =>
                      !(
                        item.tiffinMenuId === id &&
                        item.day === day &&
                        areCustomizedItemsEqual(
                          item.customizedItems || [],
                          customizedItems || []
                        )
                      )
                  )
                : localCart.tiffins,
            items:
              type === "product"
                ? localCart.items.filter(
                    (item) =>
                      !(
                        item._id === id &&
                        (!skuId || item?.sku?._id === skuId) &&
                        (!combination ||
                          JSON.stringify(item?.combination) ===
                            JSON.stringify(combination))
                      )
                  )
                : localCart.items,
          };

          localStorage.setItem("cart", JSON.stringify(updatedCart));
          dispatch(setCart(updatedCart));
          dispatch(
            setCartCount(updatedCart.tiffins.length + updatedCart.items.length)
          );
          Toast({ message: "Removed from cart!", type: "success" });
        } else {
          let data = {
            user_id: user?.userid,
            type,
            quantity: 0,
          };

          if (type === "product") {
            const productItem = cart?.items?.items?.find(
              (item) => item.product_id === id
            );

            if (!productItem) {
              Toast({ message: "Product not found!", type: "error" });
              return;
            }
            data.product_id = productItem.product_id;
            data.skuId = skuId;
            data.combination = combination;
          } else if (type === "tiffin") {
            const tiffinItem = cart?.items?.tiffins?.find(
              (item) =>
                item.tiffinMenuId === id &&
                item.day === day &&
                areCustomizedItemsEqual(
                  item.customizedItems || [],
                  customizedItems || []
                )
            );

            if (!tiffinItem) {
              Toast({ message: "Tiffin not found!", type: "error" });
              return;
            }

            data.tiffinMenuId = tiffinItem.tiffinMenuId;
            data.day = tiffinItem.day;
            data.customizedItems = tiffinItem.customizedItems || [];
          } else {
            Toast({ message: "Invalid item type!", type: "error" });
            return;
          }

          const res = await UpdateUserCart(data);
          dispatch(setCart(res.data.data));
          dispatch(
            setCartCount(
              (res.data.data.items?.items?.length || 0) +
                (res.data.data.items?.tiffins?.length || 0)
            )
          );
          Toast({ message: "Removed from cart!", type: "success" });
        }
      } catch (error) {
        console.error("Error deleting item from cart", error);
        Toast({ message: "Failed to remove item from cart", type: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, dispatch, cart]
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
    const tiffinTotal = tiffinItems?.reduce((acc, item) => {
      const price = parseFloat(item?.price || 0);
      const qty = parseInt(item?.quantity || 1, 10);
      return acc + price * qty;
    }, 0);
    return (productTotal + tiffinTotal).toFixed(2);
  }, [cart, isAuthenticated]);

  const renderCartItem = (item, index, type) => {
    return (
      <div className={style.cartItem} key={index}>
        <div className={style.cartItemImageContainer}>
          <img
            src={
              type === "product"
                ? isAuthenticated
                  ? item?.sku?.images?.[0] ||
                    item?.productDetails?.images?.[0]?.url ||
                    "/defaultImage.png"
                  : (item?.sku?.details &&
                      typeof item.sku.details === "object" &&
                      item.sku.details?.SKUImages?.[0]) ||
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
            {type === "tiffin" && (
              <p>{item?.tiffinMenuDetails?.name.toUpperCase()}</p>
            )}
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
                  : isAuthenticated
                  ? item?.customizedItems?.reduce(
                      (acc, cur) =>
                        acc + Number(cur.price) * Number(cur.quantity),
                      0
                    ) || 0
                  : parseFloat(item?.price || 0).toFixed(2)}{" "}
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
                type === "tiffin" ? item.customizedItems : undefined,
                type === "product" ? item?.sku?._id : undefined,
                type === "product" ? item?.combination : undefined
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
              onClick={() => {
                if (
                  cart.items.items.length > 0 ||
                  cart.items.tiffins.length > 0
                ) {
                  navigate("/checkout");
                }
              }}
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
