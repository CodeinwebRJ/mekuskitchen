import { useEffect, useState } from "react";
import { getOrderById } from "../../axiosConfig/AxiosConfig";
import styles from "../../styles/OrderCard.module.css";
import { formatDate } from "../../Utils/FormateDate";
import DialogBox from "../MainComponents/DialogBox";

const OrderCard = ({ order }) => {
  const status = order?.orderStatus?.toLowerCase();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleViewOrder = async (id) => {
    try {
      setLoading(true);
      console.log(id);
      const res = await getOrderById(id);
      setData(res.data.data);
      setLoading(false);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.header}>
          <span
            className={`${styles.status} ${
              status === "delivered"
                ? styles.delivered
                : status === "pending"
                ? styles.pending
                : status === "cancelled"
                ? styles.cancelled
                : ""
            }`}
          >
            {order?.orderStatus}
          </span>
          <span className={styles.review}>⭐ Rate & Review Product</span>
        </div>

        <div className={styles.info}>
          <span>{formatDate(order?.Orderdate)}</span>
          <span>Order No: {order?.orderId}</span>
          <span className={styles.total}>
            Total: <strong>${order?.grandTotal} CAD</strong>
          </span>
        </div>

        <hr className={styles.divider} />

        <div className={styles.productSection}>
          <img
            className={styles.productImage}
            src={
              order?.cartItems?.[0]?.sku?.images?.[0] ||
              order?.cartItems?.[0]?.sku?.images?.[1] ||
              order?.cartItems?.[0]?.productDetails?.images?.[0]?.url ||
              "/defaultImage.png"
            }
            alt="Product"
          />
          <div className={styles.productDetails}>
            <div className={styles.productName}>
              {order?.cartItems?.[0]?.sku?.name ||
                order?.cartItems?.[0]?.productDetails?.name ||
                "Unknown Product"}
            </div>
            <div className={styles.productPrice}>
              $
              {order?.cartItems?.[0]?.combination?.price ||
                order?.cartItems?.[0]?.productDetails?.sellingPrice ||
                "0"}{" "}
              CAD × {order?.cartItems?.[0]?.quantity || 1}
            </div>
          </div>
          <button
            className={styles.orderBtn}
            onClick={() => handleViewOrder(order._id)}
          >
            Order Details
          </button>
        </div>
      </div>

      <DialogBox isOpen={open} onClose={() => setOpen(false)} title={loading}>
        sadfkj
      </DialogBox>
    </>
  );
};

export default OrderCard;
