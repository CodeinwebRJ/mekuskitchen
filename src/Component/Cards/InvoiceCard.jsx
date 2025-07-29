import { useEffect, useRef, useState } from "react";
import style from "../../styles/InvoiceCard.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

const InvoiceCard = ({ order }) => {
  const invoiceRef = useRef();
  const [open, setOpen] = useState(false);
  const [generatePDF, setGeneratePDF] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    setOpen(true);
    setGeneratePDF(true);
  };

  useEffect(() => {
    if (open && generatePDF && invoiceRef.current) {
      const timer = setTimeout(async () => {
        try {
          const input = invoiceRef.current;
          const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          const pageWidth = pdf.internal.pageSize.getWidth();

          const margin = 10;
          const availableWidth = pageWidth - margin * 2;

          const imgWidth = canvas.width;
          const imgHeight = canvas.height;

          const scale = availableWidth / imgWidth;
          const finalWidth = imgWidth * scale;
          const finalHeight = imgHeight * scale;

          const x = margin;
          const y = margin;
          pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
          pdf.save(`Invoice_${order.orderId}.pdf`);
        } catch (err) {
          console.error("Failed to generate PDF:", err);
        } finally {
          setGeneratePDF(false);
          setOpen(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [open, generatePDF]);

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
                  <tr key={`tiffin-${i}`}>
                    <td>{tiffin?.tiffinMenuDetails?.name}</td>
                    <td>{tiffin?.day}</td>
                    <td>
                      {tiffin?.customizedItems.map((item, index) => (
                        <div key={index}>
                          {item.name} - {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>
                      {tiffin?.customizedItems.reduce(
                        (sum, item) => sum + parseInt(item.quantity),
                        0
                      )}
                    </td>
                    <td>
                      $
                      {tiffin?.customizedItems
                        .reduce(
                          (total, item) =>
                            total +
                            parseFloat(item.price) * parseFloat(item.quantity),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td>${parseFloat(tiffin?.totalAmount).toFixed(2)}</td>
                  </tr>
                ))
              ) : order.cartItems?.length > 0 ? (
                order.cartItems.map((item, i) => (
                  <tr key={`cart-${i}`}>
                    <td>{item.productDetails?.name || "Unknown Item"}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                      $
                      {(
                        parseFloat(item.price) * parseInt(item.quantity)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No items found</td>
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
