import React, { useEffect, useRef } from "react";
import style from "../../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import Button from "../Buttons/Button";
import { BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { getUserCart, UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  const fetchUserCart = async () => {
    try {
      const res = await getUserCart(user.userid);
      dispatch(setCart(res.data.data));
    } catch (error) { 
      console.error("Error fetching user cart", error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [isOpen]);

  const handleDelete = async (id, type, dayName = null) => {
    try {
      const data = {
        user_id: User?.userid,
        type: type,
        quantity: 0,
        product_id: type === "product" ? id : undefined,
        tiffinMenuId: type === "tiffin" ? id : undefined,
        day: type === "tiffin" ? dayName : undefined,
      };

      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const calculateSubtotal = () => {
    const subtotal = Cart?.items?.items
      ?.reduce((acc, item) => acc + item?.price * item?.quantity, 0)
      .toFixed(2);
    return subtotal;
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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
                      item?.productDetails?.images?.[0].url ||
                      "/default-image.jpg"
                    }
                    alt={item.day || "Tiffin item"}
                    className={style.cartItemImage}
                  />
                </div>

                <div className={style.cartItemDetails}>
                  <div>
                    <p className={style.cartItemName}>
                      {item?.productDetails?.name?.toUpperCase()}
                    </p>
                    <p className={style.cartItemCalculation}>
                      <span className={style.quantity}>{item.quantity}</span>
                      <span className={style.multiply}>×</span>
                      <span className={style.price}>
                        ${item?.productDetails?.price}
                      </span>
                    </p>
                  </div>
                  <div
                    className={style.deleteButton}
                    onClick={() => handleDelete(item.product_id, "product")}
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
                      item.tiffinMenuDetails?.image_url?.[0].url ||
                      "/default-image.jpg"
                    }
                    alt={item.day || "Tiffin item"}
                    className={style.cartItemImage}
                  />
                </div>

                <div className={style.cartItemDetails}>
                  <div>
                    <p className={style.cartItemName}>{item?.day}</p>
                    <p className={style.cartItemCalculation}>
                      <span className={style.quantity}>{item?.quantity}</span>
                      <span className={style.multiply}>×</span>
                      <span className={style.price}>${item?.totalAmount}</span>
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

        {Cart?.items?.items?.length === 0 &&
          Cart?.items?.tiffins?.length === 0 && (
            <div className={style.cartContainer}>
              <div className={style.emptyCartText}>
                <h5>Your Cart Is Empty</h5>
              </div>
            </div>
          )}

        <div className={style.cartItemSubtotal}>
          <div className={style.subtotalContainer}>
            <h5 className={style.subtotalText}>SUBTOTAL:</h5>
            <h5 className={`${style.subtotalPrice} price`}>
              ${calculateSubtotal()}
            </h5>
          </div>

          <div className={style.subtotalButtons}>
            <div className={style.viewCart}>
              <Link to={"/cart"}>
                <Button variant="light" size="sm">
                  VIEW CART
                </Button>
              </Link>
            </div>
            <Link to="/checkout">
              <Button variant="primary" size="sm">
                CHECKOUT
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
