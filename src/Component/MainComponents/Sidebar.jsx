import React, { useEffect, useRef } from "react";
import style from "../../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import Button from "../Buttons/Button";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { getUserCart, UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const User = useSelector((state) => state.auth.user);
  const Cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  const fetchUserCart = async () => {
    try {
      const user_id = User?.userid;
      const res = await getUserCart(user_id);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error fetching user cart", error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, [isOpen]);

  const handleDeleteItem = async (id) => {
    try {
      const data = {
        user_id: User?.userid,
        type: "product",
        product_id: id,
        quantity: 0,
      };
      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const handleDeleteTiffin = async (id, dayName) => {
    try {
      const data = {
        user_id: User?.userid,
        type: "tiffin",
        quantity: 0,
        tiffinMenuId: id,
        day: dayName,
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

  return (
    <>
      {isOpen && <div className={style.backdrop} onClick={onClose}></div>}
      <div
        className={`${style.sidebar} ${isOpen ? style.open : ""}`}
        ref={sidebarRef}
      >
        <div className={style.closeBtn}>
          <h5>SHOPPING CART</h5>
          <FaTimes className={style.closeIcon} onClick={onClose} />
        </div>

        {Cart?.items?.items && Cart?.items?.items?.length > 0 && (
          <div className={style.cartContainer}>
            {Cart?.items?.tiffins?.map((item, index) => (
              <div className={style.cartItem} key={index}>
                <div className={style.cartItemImageContainer}>
                  <img
                    src={item?.tiffinMenuDetails?.image_url[0]}
                    alt="product"
                    className={style.cartItemImage}
                  />
                </div>

                <div className={style.cartItemDetails}>
                  <p className={style.cartItemName}>{item?.day}</p>
                  <p className={style.cartItemCalculation}>
                    <span className={style.quantity}>{item?.quantity}</span>
                    <span className={style.multiply}>×</span>
                    <span className="price">${item?.totalAmount}</span>
                  </p>
                  <div onClick={() => handleDeleteItem(item.product_id)}>
                    <RiDeleteBin5Fill className={style.deleteIcon} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Cart?.items?.tiffins && Cart.items.tiffins.length > 0 && (
          <div className={style.cartContainer}>
            {Cart.items.tiffins.map((item, index) => (
              <div className={style.cartItem} key={index}>
                <div className={style.cartItemImageContainer}>
                  <img
                    src={item?.tiffinMenuDetails?.image_url?.[0]}
                    alt="product"
                    className={style.cartItemImage}
                  />
                </div>

                <div className={style.cartItemDetails}>
                  <p className={style.cartItemName}>{item?.day}</p>
                  <p className={style.cartItemCalculation}>
                    <span className={style.quantity}>{item?.quantity}</span>
                    <span className={style.multiply}>×</span>
                    <span className="price">${item?.totalAmount}</span>
                  </p>
                  <div
                    onClick={() =>
                      handleDeleteTiffin(item.tiffinMenuId, item.day)
                    }
                  >
                    <RiDeleteBin5Fill className={style.deleteIcon} />
                  </div>
                </div>
              </div>
            ))}
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
            <Link to={"/cart"}>
              <Button variant="light" size="sm">
                VIEW CART
              </Button>
            </Link>
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
