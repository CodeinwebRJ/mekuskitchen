import React, { useEffect } from "react";
import styles from "../styles/Sidebar.module.css";
import { FaTimes } from "react-icons/fa";
import Button from "../UI/Button";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { getUserCart } from "../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../Store/Slice/UserCartSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const User = useSelector((state) => state.auth.user);
  const Cart = useSelector((state) => state.cart);
  console.log(Cart.cart.items);
  const dispatch = useDispatch();

  const fetchUserCart = async () => {
    try {
      const user_id = User?.userid;
      const res = await getUserCart(user_id);
      console.log(res.data.data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCart();
  }, []);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.closeBtn} onClick={onClose}>
        <h5>SHOPPING CART</h5>
        <FaTimes className={styles.closeIcon} />
      </div>

      <div className={styles.cartContainer}>
        {Cart?.cart?.items?.map((item, index) => (
          <div className={styles.cartItem} key={index}>
            <div className={styles.cartItemImageContainer}>
              <img
                src={item.productDetails.image_url[0]}
                alt="image 1"
                className={styles.cartItemImage}
              />
            </div>

            <div className={styles.cartItemDetails}>
              <p className={styles.cartItemName}>Masala Paratha</p>
              <p className={styles.cartItemCalculation}>
                <span className={styles.quantity}>{item.quantity}</span>
                <span className={styles.multiply}>×</span>
                <span className={styles.price}>{item.price}</span>
              </p>

              <RiDeleteBin5Fill className={styles.deleteIcon} />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.cartItemSubtotal}>
        <div className={styles.subtotalContainer}>
          <h5 className={styles.subtotalText}>SUBTOTAL:</h5>
          <h5 className={styles.subtotalPrice}>$3.20</h5>
        </div>

        <div className={styles.subtotalButtons}>
          <Link to={"/cart"}>
            <Button variant="light">VIEW CART</Button>
          </Link>
          <Button variant="primary">CHECKOUT</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
