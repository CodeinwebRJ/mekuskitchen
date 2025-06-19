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
      item?.sku?.images?.find(Boolean) ||
      item?.productDetails?.images?.[0]?.url ||
      "/defaultImage.png"
    );
  };

  const firstItem = order?.cartItems?.[0];
  const totalItems = order?.cartItems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

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
            <span>{formatDate(order?.Orderdate)}</span>
            <span>Order No: {order?.orderId}</span>
            <span>
              Total Items : {totalItems} Item{totalItems > 1 ? "s" : ""}
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
            alt="Product"
          />
          <div className={styles.productDetails}>
            <div className={styles.productName}>
              {firstItem?.sku?.name ||
                firstItem?.productDetails?.name ||
                "Unknown Product"}
            </div>
            <div className={styles.productPrice}>
              $
              {firstItem?.combination?.price ||
                firstItem?.productDetails?.sellingPrice ||
                "0"}{" "}
              CAD × {firstItem?.quantity || 1}
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

          {order?.cartItems?.map((item, index) => {
            const details = item?.productDetails;

            return (
              <div key={index} className={styles.dialogCard}>
                <div className={styles.productSection}>
                  <img
                    className={styles.productImage}
                    src={getFirstImage(item)}
                    alt="Product"
                  />
                  <div className={styles.productDetails}>
                    <div className={styles.productName}>
                      {details?.name || "Unknown Product"}
                    </div>
                    <div className={styles.productPrice}>
                      ${item?.price || details?.sellingPrice || "0"} CAD ×{" "}
                      {item?.quantity || 1}
                    </div>
                    <div className={styles.productDescription}>
                      {details?.description || "No description available."}
                    </div>
                    <div className={styles.productMeta}>
                      {details?.brand && (
                        <span>
                          <strong>Brand:</strong> {details?.brand || "N/A"}
                        </span>
                      )}
                      <span>
                        <strong>Category:</strong> {details?.category} &raquo;{" "}
                        {details?.subCategory}
                      </span>
                      {details?.productDetail?.[0]?.details?.color && (
                        <span>
                          <strong>Color:</strong>{" "}
                          {details?.productDetail?.[0]?.details?.color || "N/A"}
                        </span>
                      )}
                      {details?.productDetail?.[0]?.details?.material && (
                        <span>
                          <strong>Material:</strong>{" "}
                          {details?.productDetail?.[0]?.details?.material}
                        </span>
                      )}
                      <span>
                        <strong>Weight:</strong> {details?.weight || "N/A"}{" "}
                        {details?.weightUnit || "kg"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogBox>
    </>
  );
};

export default OrderCard;
