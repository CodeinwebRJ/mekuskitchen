import { BsTrash } from "react-icons/bs";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa";
import style from "../../styles/CartTable.module.css";
import { MdEdit } from "react-icons/md";

const CartItem = ({
  item,
  type,
  isAuthenticated,
  onDelete,
  onUpdateQuantity,
  onShowProduct,
}) => {
  const isProduct = type === "product";

  const imageUrl = isProduct
    ? isAuthenticated
      ? item?.sku?.images?.[0] || item?.productDetails?.images?.[0]?.url
      : (item.sku && item?.sku?.details?.SKUImages[0]) || item?.images?.[0]?.url
    : isAuthenticated
    ? item?.tiffinMenuDetails?.image_url?.[0]?.url
    : item?.image_url?.[0]?.url || "/defaultImage.png";

  const name = isProduct
    ? isAuthenticated
      ? (item.sku && item?.sku?.skuName) ||
        item?.productDetails?.name ||
        item?.name
      : item?.name || "Unnamed Product"
    : isAuthenticated
    ? item?.tiffinMenuDetails.name
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

  const combination = isAuthenticated
    ? item?.combination
    : item?.sku?.details?.combinations;
  return (
    <tr className={style.cartItem}>
      <td>
        <div className={style.productCell}>
          <div className={style.productImageContainer}>
            <img src={imageUrl} alt={type} className={style.cartItemImage} />
          </div>
          <div className={style.productName}>
            <span>{name} </span>
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
          {type === "product" && combination && (
            <div>
              {Object.entries(combination)
                .filter(([key]) => key !== "Stock" && key !== "Price")
                .map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
            </div>
          )}
        </div>
      </td>

      {type === "tiffin" && (
        <td className={style.customizedItemsCell}>
          {item.customizedItems.map((customItem, index) => (
            <div className={style.customizedItems} key={index}>
              {customItem.name} - {customItem.quantity}
            </div>
          ))}
        </td>
      )}
      {type === "tiffin" && <td>{item.day}</td>}

      <td>${Number(price)?.toFixed(2)}</td>
      <td>
        <div className={style.quantityControl}>
          <button
            onClick={() =>
              onUpdateQuantity(item._id, -1, type, {
                day: item?.day,
                customizedItems: item?.customizedItems,
                skuId: item?.sku?.skuId,
                combination: item?.combination,
              })
            }
            disabled={item?.quantity <= 1}
          >
            <FaMinus size={14} />
          </button>
          <span className={style.quantity}>{item.quantity}</span>
          <button
            onClick={() =>
              onUpdateQuantity(item._id, 1, type, {
                day: item?.day,
                customizedItems: item?.customizedItems,
                skuId: item?.sku?.skuId,
                combination: item?.combination,
              })
            }
          >
            <FaPlus size={14} />
          </button>
        </div>
      </td>
      {/* <td className={style.totalPrice}>
        ${(price * item?.quantity).toFixed(2)}{" "}
      </td> */}
      {/* <td className={style.totalPrice}>
        ${(price * item?.quantity).toFixed(2)}
        {price * item?.quantity < 12 && (
          <div className={style.deliveryCharge}>+ $3 Delivery Charge</div>
        )}
      </td> */}
      <td className={style.totalPrice}>
        ${(price * item?.quantity).toFixed(2)}
        {type === "tiffin" &&
          price * item?.quantity < 12 && ( // Only show for tiffins
            <div className={style.deliveryCharge}>+ $3 Delivery Charge</div>
          )}
      </td>

      <td>
        <div className={style.removeCell}>
          <div
            className=""
            onClick={() =>
              onShowProduct(
                type === "product" ? item._id : item.tiffinMenuId,
                type,
                item?.day,
                item?.customizedItems,
                item?.sku?._id,
                item?.combination
              )
            }
          >
            {(type === "tiffin" && item?.tiffinMenuDetails?.isCustomized) ||
            item?.isCustomized ? (
              <MdEdit className={style.editIcon} />
            ) : (
              <FaEye className={style.editIcon} />
            )}
          </div>
          <div
            onClick={() =>
              onDelete(
                isProduct ? item._id : item.tiffinMenuId,
                type,
                item.day,
                item.customizedItems,
                item?.sku?._id,
                item?.combination
              )
            }
          >
            <BsTrash className={style.removeIcon} />
          </div>
        </div>
      </td>
    </tr>
  );
};

const CartTable = ({
  items = [],
  tiffins = [],
  isAuthenticated,
  onDelete,
  onUpdateQuantity,
  onShowProduct,
}) => {
  return (
    <table className={style.cartTable}>
      <thead>
        <tr className={style.cartItem}>
          <th>Product</th>
          {tiffins.length > 0 && <th>Items</th>}
          {tiffins.length > 0 && <th>Day</th>}
          <th>Price (CAD)</th>
          <th>Quantity</th>
          <th>Total Price (CAD)</th>
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
          />
        ))}
      </tbody>
    </table>
  );
};

export default CartTable;
