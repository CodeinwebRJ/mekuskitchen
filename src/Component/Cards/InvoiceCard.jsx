import { useEffect, useRef, useState } from "react";
import style from "../../styles/InvoiceCard.module.css";
import html2pdf from "html2pdf.js";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

const InvoiceCard = ({ order }) => {
  const invoiceRef = useRef();
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    html2pdf()
      .set({
        margin: 0,
        filename: `Invoice_${order.orderId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(invoiceRef.current)
      .save();
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const totalItems = order?.tiffinItems?.length
    ? order.tiffinItems.reduce(
        (acc, tiffin) => acc + tiffin.customizedItems.length,
        0
      )
    : order?.cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <div onClick={() => setOpen(true)} className={style.card}>
        <div className={style.topRightButtons}>
          <button className={style.previewBtn} onClick={() => setOpen(true)}>
            <FaEye color="white" />
          </button>
          <button className={style.downloadBtn} onClick={handleDownload}>
            <IoMdDownload color="white" />
          </button>
        </div>

        <div className={style.cardHeader}>
          <div className={style.iconWrapper}>
            <FaFileInvoice className={style.icon} />
          </div>
          <div>
            <p className={style.label}>{order.orderId}</p>
            <p className={style.date}>
              {new Date(order.Orderdate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className={style.cardBody}>
          <p>
            <strong>Total:</strong> ${order.grandTotal}
          </p>
          <p>
            <strong>Items:</strong> {totalItems}
          </p>
        </div>
      </div>

      {open && (
        <InvoiceDialog
          onClose={() => setOpen(false)}
          order={order}
          invoiceRef={invoiceRef}
        />
      )}
    </>
  );
};

const InvoiceDialog = ({ onClose, order, invoiceRef }) => {
  const { billing } = order?.address || {};

  const isTiffin = order?.tiffinItems?.length > 0;
  console.log(order);

  return (
    <div className={style.overlay}>
      <div className={style.dialogBox}>
        <div className={style.dialogHeader}>
          <h2 className={style.dialogTitle}>Invoice {order.orderId}</h2>
          <span onClick={onClose} className={style.closeBtn}>
            ✕
          </span>
        </div>

        <div className={style.dialogContent} ref={invoiceRef}>
          <div className={style.brandHeader}>
            <img
              src="/logo.png"
              alt="TiffinBox Logo"
              className={style.logoImage}
            />
            <div>
              <h3 className={style.dialogTitle}>Meku's Kitchen</h3>
              <p className={style.dialogSubtext}>mekuskitchen@gmail.com</p>
            </div>
          </div>

          <div className={style.metaInfo}>
            <p>
              <strong>Invoice Date:</strong>{" "}
              {new Date(order.Orderdate).toLocaleDateString()}
            </p>
            <p>
              <strong>Customer:</strong> {billing?.name || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {billing?.phoneCode || ""}{" "}
              {billing?.phone || "N/A"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {billing
                ? `${billing.address}, ${billing.city}, ${billing.state}, ${billing.country} - ${billing.postCode}`
                : "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {billing?.email || "N/A"}
            </p>
            <p>
              <strong>Order ID:</strong> {order.orderId}
            </p>
          </div>

          <table className={style.table}>
            <thead>
              <tr>
                <th>Name</th>
                {isTiffin && <th>Day</th>}
                {isTiffin && <th>Item</th>}
                <th>Qty</th>
                <th>Price ($)</th>
                <th>Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {order.tiffinItems?.length > 0 ? (
                order.tiffinItems.flatMap((tiffin, i) => (
                  <tr>
                    <td>{tiffin?.tiffinMenuDetails?.name}</td>
                    <td>{tiffin?.day}</td>
                    <td>{tiffin?.tiffinMenuDetails?.name}</td>
                    <td>
                      {tiffin?.customizedItems.map((item, index) => (
                        <div key={index}>
                          {item.name} - {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>
                      $
                      {tiffin?.customizedItems
                        ?.reduce(
                          (total, item) =>
                            total +
                            parseFloat(item.price) * parseFloat(item.quantity),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td>${tiffin?.totalAmount}</td>
                  </tr>
                ))
              ) : order.cartItems?.length > 0 ? (
                order.cartItems.map((item, i) => (
                  <tr key={`cart-${i}`}>
                    <td>{item.productDetails?.name || "Unknown Item"}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      {(
                        parseFloat(item.price) * parseInt(item.quantity)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No items found</td>
                </tr>
              )}
            </tbody>
          </table>

          <p className={style.total}>Grand Total: ${order.grandTotal}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
