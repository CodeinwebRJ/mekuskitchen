import { BsTrash } from "react-icons/bs";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import style from "../../styles/CartTable.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAddress, checkPincode } from "../../axiosConfig/AxiosConfig";
import {
  setAddresses,
  setDefaultAddress,
} from "../../../Store/Slice/AddressSlice";
import DialogBox from "../MainComponents/DialogBox";
import AddressForm from "../../Routes/MyAccount/Addresses/AddressForm";

const CartItem = ({
  item,
  type,
  isAuthenticated,
  onDelete,
  onUpdateQuantity,
  onShowProduct,
  addresses,
  rowDeliveryStatus,
  setRowDeliveryStatus,
  rowMessages,
  setRowMessages,
}) => {
  const [open, setOpen] = useState(false);
  const isProduct = type === "product";
  const [dialog, setDialog] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState("");

  const imageUrl = isProduct
    ? isAuthenticated
      ? item?.sku?.images?.[0] || item?.productDetails?.images?.[0]?.url
      : item?.sku?.details?.SKUImages?.[0] || item?.images?.[0]?.url
    : isAuthenticated
    ? item?.tiffinMenuDetails?.image_url?.[0]?.url
    : item?.image_url?.[0]?.url || "/defaultImage.png";

  const name = isProduct
    ? isAuthenticated
      ? item?.sku?.skuName || item?.productDetails?.name || item?.name
      : item?.name || "Unnamed Product"
    : isAuthenticated
    ? item?.tiffinMenuDetails?.name
    : item?.name;

  const price = isProduct
    ? isAuthenticated
      ? item?.price
      : item?.sku?.details?.combinations?.Price || item?.price || 0
    : isAuthenticated
    ? item?.customizedItems?.reduce(
        (acc, cur) => acc + Number(cur.price) * Number(cur.quantity),
        0
      )
    : item?.price || 0;

  const totalPrice = (price * item?.quantity).toFixed(2);
  const showDeliveryCharge = type === "tiffin" && price * item?.quantity < 12;

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const firstAddr = addresses[0];
      setSelectedAddress(firstAddr._id);

      if (firstAddr?.billing?.postCode) {
        (async () => {
          try {
            const res = await checkPincode(firstAddr.billing.postCode);
            if (res?.data?.statusCode === 200) {
              setRowDeliveryStatus((prev) => ({
                ...prev,
                [item._id]: "success",
              }));
              setRowMessages((prev) => ({
                ...prev,
                [item._id]: "Delivery available for this address",
              }));
            }
          } catch (error) {
            setRowDeliveryStatus((prev) => ({
              ...prev,
              [item._id]: "error",
            }));
            setRowMessages((prev) => ({
              ...prev,
              [item._id]: "Delivery not available for this address",
            }));
          }
        })();
      }
    }
  }, [addresses, selectedAddress]);

  return (
    <>
      <tr className={style.cartItem}>
        <td>
          <div className={style.productCell}>
            <div className={style.productImageContainer}>
              <img src={imageUrl} alt={type} className={style.cartItemImage} />
            </div>
            <div className={style.productName}>
              <span>{name}</span>
              {type === "tiffin" && (
                <span>
                  {isAuthenticated ? (
                    item?.tiffinMenuDetails?.isCustomized ? (
                      <span className={style.customizedBadge}>Customized</span>
                    ) : (
                      <span className={style.customizedBadge}>Regular</span>
                    )
                  ) : item?.isCustomized ? (
                    <span className={style.customizedBadge}>Customized</span>
                  ) : (
                    <span className={style.customizedBadge}>Regular</span>
                  )}
                </span>
              )}
            </div>
          </div>
        </td>

        {type === "tiffin" && <td>{item.day}</td>}

        <td>${Number(price).toFixed(2)}</td>
        <td>
          <div className={style.quantityControl}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity(item._id, -1, type, {
                  day: item?.day,
                  customizedItems: item?.customizedItems,
                  skuId: item?.sku?.skuId,
                  combination: item?.combination,
                });
              }}
              disabled={item?.quantity <= 1}
            >
              <FaMinus size={14} />
            </button>
            <span className={style.quantity}>{item.quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateQuantity(item._id, 1, type, {
                  day: item?.day,
                  customizedItems: item?.customizedItems,
                  skuId: item?.sku?.skuId,
                  combination: item?.combination,
                });
              }}
            >
              <FaPlus size={14} />
            </button>
          </div>
        </td>

        <td className={style.totalPrice}>${totalPrice}</td>

        <td>
          <div className={style.removeCell}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onShowProduct(
                  type === "product" ? item._id : item.tiffinMenuId,
                  type,
                  item?.day,
                  item?.customizedItems,
                  item?.sku?._id,
                  item?.combination
                );
              }}
            >
              {(type === "tiffin" && item?.tiffinMenuDetails?.isCustomized) ||
              item?.isCustomized ? (
                <MdEdit className={style.editIcon} />
              ) : (
                <FaEye className={style.editIcon} />
              )}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDelete(
                  isProduct ? item._id : item.tiffinMenuId,
                  type,
                  item.day,
                  item.customizedItems,
                  item?.sku?._id,
                  item?.combination
                );
              }}
            >
              <BsTrash className={style.removeIcon} />
            </div>
          </div>
        </td>
      </tr>

      <tr className={style.deliveryRow}>
        <td colSpan="6">
          <div className={style.deliveryWrapper}>
            <label>Delivery Location:</label>
            <select
              className={style.addressDropdown}
              value={selectedAddress}
              onChange={async (e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "add-new") {
                  setDialog(true);
                  return;
                }
                const addr = addresses.find((a) => a._id === selectedValue);
                setSelectedAddress(addr?._id || "");
                if (addr?.billing?.postCode) {
                  try {
                    const res = await checkPincode(addr.billing.postCode);
                    if (res?.data?.statusCode === 200) {
                      setRowDeliveryStatus((prev) => ({
                        ...prev,
                        [item._id]: "success",
                      }));
                      setRowMessages((prev) => ({
                        ...prev,
                        [item._id]: "",
                      }));
                    }
                  } catch {
                    setRowDeliveryStatus((prev) => ({
                      ...prev,
                      [item._id]: "error",
                    }));
                    setRowMessages((prev) => ({
                      ...prev,
                      [item._id]: "Delivery not available for this address",
                    }));
                  }
                }
              }}
            >
              {addresses.map((addr, idx) => (
                <option key={idx} value={addr._id}>
                  {addr.billing?.city} ({addr.billing?.postCode})
                </option>
              ))}
              <option value="add-new">+ Add New Address</option>
            </select>

            {rowMessages[item._id] && (
              <p
                className={`${style.deliveryMessage} ${
                  rowDeliveryStatus[item._id] === "success"
                    ? style.success
                    : rowDeliveryStatus[item._id] === "warning"
                    ? style.warning
                    : style.error
                }`}
              >
                {rowMessages[item._id]}
              </p>
            )}

            {showDeliveryCharge ? (
              <div className={style.deliveryCharge}>+ $3 Delivery</div>
            ) : (
              <div className={style.freeDelivery}>Free Delivery</div>
            )}
          </div>
          <DialogBox
            isOpen={dialog}
            title="Add Delivery Address"
            onClose={() => setDialog(false)}
          >
            <AddressForm
              onClose={() => setDialog(false)}
              // fetchAddress={fetchAddress}
            />
          </DialogBox>
        </td>
      </tr>

      {type === "tiffin" && (
        <tr className={style.accordionRow}>
          <td colSpan="6">
            <div
              className={style.accordionHeader}
              onClick={() => setOpen(!open)}
            >
              <button className={style.toggleBtn}>
                {open ? <FaMinus size={12} /> : <FaPlus size={12} />}
              </button>
              <span className={style.accordionTitle}>View Tiffin Items</span>
            </div>

            {open && (
              <table className={style.innerTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tiffin Item Name</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {item.customizedItems?.length > 0 ? (
                    item.customizedItems.map((ci, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{ci.name}</td>
                        <td style={{ textAlign: "center" }}>{ci.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

const CartTable = ({
  items = [],
  tiffins = [],
  isAuthenticated,
  onDelete,
  onUpdateQuantity,
  onShowProduct,
  setIsDeliveryAvailable, // 👈 pass setter from parent page
}) => {
  const { user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();

  const [rowDeliveryStatus, setRowDeliveryStatus] = useState({});
  const [rowMessages, setRowMessages] = useState({});

  // watch rowDeliveryStatus -> update global delivery availability
  useEffect(() => {
    if (Object.values(rowDeliveryStatus).includes("error")) {
      setIsDeliveryAvailable(false);
    } else {
      setIsDeliveryAvailable(true);
    }
  }, [rowDeliveryStatus, setIsDeliveryAvailable]);

  return (
    <table className={style.cartTable}>
      <thead>
        <tr className={style.cartItem}>
          {/* <th></th> */}
          <th>Product</th>
          {tiffins.length > 0 && <th>Day</th>}
          <th>Price (CAD)</th>
          <th>Quantity</th>
          <th>Total (CAD)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            type="product"
            isAuthenticated={isAuthenticated}
            onDelete={onDelete}
            onUpdateQuantity={onUpdateQuantity}
            onShowProduct={onShowProduct}
            addresses={addresses}
            rowDeliveryStatus={rowDeliveryStatus}
            setRowDeliveryStatus={setRowDeliveryStatus}
            rowMessages={rowMessages}
            setRowMessages={setRowMessages}
          />
        ))}
        {tiffins.map((tiffin, index) => (
          <CartItem
            key={index}
            item={tiffin}
            type="tiffin"
            isAuthenticated={isAuthenticated}
            onDelete={onDelete}
            onUpdateQuantity={onUpdateQuantity}
            onShowProduct={onShowProduct}
            addresses={addresses}
            rowDeliveryStatus={rowDeliveryStatus}
            setRowDeliveryStatus={setRowDeliveryStatus}
            rowMessages={rowMessages}
            setRowMessages={setRowMessages}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
