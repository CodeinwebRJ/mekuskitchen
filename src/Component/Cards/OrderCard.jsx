import { useState } from "react";
import styles from "../../styles/OrderCard.module.css";
import { formatDate } from "../../Utils/FormateDate";
import DialogBox from "../MainComponents/DialogBox";

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const status = order?.orderStatus?.toLowerCase();
  const handleToggle = () => setOpen(!open);

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return styles.delivered;
      case "pending":
        return styles.pending;
      case "cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const getFirstImage = (item) => {
    return (
      item?.sku?.images?.[0]?.url ||
      item?.productDetails?.images?.[0]?.url ||
      item?.tiffinMenuDetails?.image_url?.[0]?.url ||
      "/defaultImage.png"
    );
  };

  const totalItems =
    (order?.cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
      0) +
    (order?.tiffinItems?.reduce(
      (sum, tiffin) => sum + (tiffin.quantity || 0),
      0
    ) || 0);

  const firstItem = order?.cartItems?.[0] || order?.tiffinItems?.[0];

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={`${styles.status} ${getStatusClass(status)}`}>
            {order?.orderStatus}
          </span>
          <span className={styles.review}>⭐ Rate & Review Product</span>
        </div>

        <div className={styles.info}>
          <div className={styles.orderInfo}>
            <span>Date: {formatDate(order?.Orderdate)}</span>
            <span>Order No: {order?.orderId}</span>
            <span>
              Total Items: {totalItems} Item{totalItems > 1 ? "s" : ""}
            </span>
          </div>
          <span className={styles.total}>
            Total: <strong>${order?.grandTotal} CAD</strong>
          </span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.productSection}>
          <img
            className={styles.productImage}
            src={getFirstImage(firstItem)}
            alt="Preview"
          />
          <div className={styles.productDetails}>
            <div className={styles.productName}>
              {firstItem?.tiffinMenuDetails?.name ||
                firstItem?.productDetails?.name ||
                "Item"}
            </div>
            <div className={styles.productPrice}>
              ${firstItem?.totalAmount || "0"} CAD × {firstItem?.quantity || 1}
            </div>
          </div>
          <button className={styles.orderBtn} onClick={handleToggle}>
            Order Details
          </button>
        </div>
      </div>

      <DialogBox isOpen={open} onClose={handleToggle} title={"Order Details"}>
        <div className={styles.dialogContent}>
          <div className={styles.orderInfo}>
            <span className={`${styles.status} ${getStatusClass(status)}`}>
              {order?.orderStatus}
            </span>
            <span className={styles.dialogOrderId}>
              Order Id: {order?.orderId}
            </span>
          </div>

          {order?.tiffinItems?.map((tiffin, index) => (
            <div key={index} className={styles.dialogCard}>
              <div className={styles.productSection}>
                <img
                  className={styles.productImage}
                  src={getFirstImage(tiffin)}
                  alt="Tiffin"
                />
                <div className={styles.productDetails}>
                  <div className={styles.productName}>
                    {tiffin?.tiffinMenuDetails?.name || "Tiffin Item"} (
                    {tiffin?.day})
                  </div>
                  <div className={styles.productPrice}>
                    ${tiffin?.totalAmount} CAD × {tiffin?.quantity}
                  </div>
                  {tiffin?.specialInstructions && (
                    <div className={styles.productDescription}>
                      <strong>Note:</strong> {tiffin.specialInstructions}
                    </div>
                  )}
                  <div className={styles.productMeta}>
                    <strong>Items:</strong>
                    <ul>
                      {tiffin?.customizedItems?.map((ci, i) => (
                        <li key={i}>
                          {ci.name} - {ci.quantity} × ${ci.price}{" "}
                          {ci.weight && ci.weightUnit
                            ? `(${ci.weight} ${ci.weightUnit})`
                            : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogBox>
    </>
  );
};

export default OrderCard;
