
import styles from "./CartItemCardMobile.module.css";
import { FaPlus, FaMinus } from "react-icons/fa";

const CartItemCardMobile = ({ item, onIncrease, onDecrease }) => {
  return (
    <div className={styles.card}>
      <img
        src={item.image || "/placeholder.jpg"}
        alt={item.name}
        className={styles.image}
      />
      <div className={styles.details}>
        <h3 className={styles.title}>{item.name}</h3>
        <p className={styles.price}>₹{item.price}</p>
        <p className={styles.description}>{item.description}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={onIncrease}>
          <FaPlus />
        </button>
        <span className={styles.quantity}>{item.quantity}</span>
        <button className={styles.btn} onClick={onDecrease}>
          <FaMinus />
        </button>
      </div>
    </div>
  );
};

export default CartItemCardMobile;
