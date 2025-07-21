import { BsTrash } from "react-icons/bs";
import { FaEye, FaMinus, FaPlus } from "react-icons/fa";
import style from "../../styles/CartTable.module.css";

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
    ? item?.productDetails?.name?.toUpperCase()
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

  return (
    <tr className={style.cartItem}>
      <td>
        <div className={style.removeCell}>
          <button
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
          </button>
          {isProduct && (
            <button onClick={() => onShowProduct(item._id)}>
              <FaEye />
            </button>
          )}
        </div>
      </td>
      <td>
        <div className={style.productCell}>
          <img src={imageUrl} alt={type} className={style.cartItemImage} />
          <span className={style.productName}>{name}</span>
        </div>
      </td>
      {type === "tiffin" && (
        <td>
          {item.customizedItems.map((customItem, index) => (
            <div className={style.customizedItems} key={index}>
              {customItem.name} - {customItem.quantity}
            </div>
          ))}
        </td>
      )}
      {type === "tiffin" && <td>{item.day}</td>}
      <td>
        ${Number(price)?.toFixed(2)} {item?.productDetails?.currency || "CAD"}
      </td>
      <td>
        <div className={style.quantityControl}>
          <button
            onClick={() =>
              onUpdateQuantity(item._id, -1, type, {
                day: item.day,
                customizedItems: item.customizedItems,
                skuId: item?.sku?._id,
                combination: item?.combination,
              })
            }
            disabled={item.quantity <= 1}
          >
            <FaMinus size={14} />
          </button>
          <span className={style.quantity}>{item.quantity}</span>
          <button
            onClick={() =>
              onUpdateQuantity(item._id, 1, type, {
                day: item.day,
                customizedItems: item.customizedItems,
                skuId: item?.sku?._id,
                combination: item?.combination,
              })
            }
          >
            <FaPlus size={14} />
          </button>
        </div>
      </td>
      <td className={style.totalPrice}>
        ${(price * item.quantity).toFixed(2)}{" "}
        {item?.productDetails?.currency || "CAD"}
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
          <th />
          <th>Product</th>
          {tiffins.length > 0 && <th>Items</th>}
          {tiffins.length > 0 && <th>Day</th>}
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
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
        {/* {!isAuthenticated &&
          items?.map((item) => {
            const unitPrice =
              item?.sku?.details?.combinations?.Price ?? item?.price ?? 0;
            const totalPrice = unitPrice * (item.quantity ?? 1);

            return (
              <tr key={item._id} className={style.cartItem}>
                <td>
                  <div className={style.removeCell}>
                    <button onClick={() => onDelete(item._id, "product")}>
                      <BsTrash className={style.removeIcon} />
                    </button>
                    <button onClick={() => onShowProduct(item._id)}>
                      <FaEye />
                    </button>
                  </div>
                </td>

                <td>
                  <div className={style.productCell}>
                    <img
                      src={
                        isAuthenticated
                          ? item?.sku?.images?.[0] ||
                            item?.productDetails?.images?.[0]?.url ||
                            "/defaultImage.png"
                          : (item.sku && item?.sku?.details?.SKUImages[0]) ||
                            item?.images?.[0]?.url ||
                            "/defaultImage.png"
                      }
                      alt={item.name}
                      className={style.cartItemImage}
                    />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td>${unitPrice.toFixed(2)}</td>

                <td>
                  <div className={style.quantityControl}>
                    <button
                      onClick={() => onUpdateQuantity(item._id, -1, "product")}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus size={14} />
                    </button>
                    <span className={style.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, 1, "product")}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                </td>

                <td className={style.totalPrice}>${totalPrice.toFixed(2)}</td>
              </tr>
            );
          })} */}
      </tbody>
    </table>
  );
};

export default CartTable;
