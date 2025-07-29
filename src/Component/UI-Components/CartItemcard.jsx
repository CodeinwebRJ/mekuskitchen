import { MdEdit } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/CartItemcard.module.css";

const CartItemCardMobile = ({
  item,
  onIncrease,
  onDecrease,
  type,
  onDelete,
  onShowProduct,
}) => {
  const isProduct = type === "product";
  return (
    <div className={styles.card}>
      <img
        src={item.image || "/placeholder.jpg"}
        alt={item.name}
        className={styles.image}
      />
      <div className={styles.details}>
        <h3 className={styles.title}>{item.name}</h3>
        {type === "tiffin" && <h6>{item.day}</h6>}
        <p className={styles.price}>${item.price}</p>
        <p className={styles.description}>{item.description}</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.actionGroup}>
          {(type === "tiffin" || type === "product") && (
            <MdEdit
              onClick={() =>
                onShowProduct(
                  isProduct ? item._id : item.items.tiffinMenuId,
                  type,
                  item?.day,
                  item.items?.customizedItems,
                  item.items?.sku?._id,
                  item.items?.combination
                )
              }
              className={styles.edit}
            />
          )}

          <BsTrash
            onClick={() =>
              onDelete(
                isProduct ? item._id : item.items.tiffinMenuId,
                type,
                item?.items?.day,
                item?.items?.customizedItems,
                item?.items?.sku?._id,
                item?.items?.combination
              )
            }
            className={styles.trashIcon}
          />
        </div>

        <div className={styles.quantityGroup}>
          <button className={styles.btn} onClick={onDecrease}>
            <FaMinus />
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button className={styles.btn} onClick={onIncrease}>
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCardMobile;
