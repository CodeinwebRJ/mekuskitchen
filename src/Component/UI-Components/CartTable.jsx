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
    ? item?.sku?.images?.[0] || item?.productDetails?.images?.[0]?.url
    : item?.tiffinMenuDetails?.image_url?.[0]?.url || "/defaultImage.png";
  const name = isProduct
    ? item?.productDetails?.name?.toUpperCase()
    : item?.day;
  const price = isProduct
    ? isAuthenticated
      ? item?.price
      : item?.sku?.details?.combinations?.Price || item?.price || 0
    : item?.tiffinMenuDetails?.totalAmount;

  return (
    <tr className={style.cartItem}>
      <td>
        <div className={style.removeCell}>
          <button
            onClick={() =>
              onDelete(
                isProduct ? item.product_id : item.tiffinMenuId,
                type,
                item.day
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
      <td>${Number(price)?.toFixed(2)}</td>
      <td>
        <div className={style.quantityControl}>
          <button
            onClick={() => onUpdateQuantity(item._id, -1, type, item.day)}
            disabled={item.quantity <= 1}
          >
            <FaMinus size={14} />
          </button>
          <span className={style.quantity}>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item._id, 1, type, item.day)}>
            <FaPlus size={14} />
          </button>
        </div>
      </td>
      <td className={style.totalPrice}>
        ${(price * item.quantity).toFixed(2)}
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
  console.log(items);
  return (
    <table className={style.cartTable}>
      <thead>
        <tr className={style.cartItem}>
          <th />
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
        </tr>
      </thead>
      <tbody>
        {isAuthenticated &&
          items?.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              type="product"
              isAuthenticated={isAuthenticated}
              onDelete={onDelete}
              onUpdateQuantity={onUpdateQuantity}
              onShowProduct={onShowProduct}
            />
          ))}
        {tiffins.map((tiffin) => (
          <CartItem
            key={tiffin._id}
            item={tiffin}
            type="tiffin"
            isAuthenticated={isAuthenticated}
            onDelete={onDelete}
            onUpdateQuantity={onUpdateQuantity}
            onShowProduct={onShowProduct}
          />
        ))}
        {!isAuthenticated &&
          items?.map((item) => (
            <tr className={style.cartItem}>
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
                    src={item?.images?.[0]?.url || "/defaultImage.png"}
                    alt={item.name}
                    className={style.cartItemImage}
                  />
                  <span>{item.name}</span>
                </div>
              </td>
              <td>
                ${item?.sku?.details?.combinations?.Price || item?.price || 0}
              </td>
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
              <td className={style.totalPrice}>
                $
                {(
                  item?.sku?.details?.combinations?.Price ||
                  item?.price ||
                  0 * item.quantity
                ).toFixed(2)}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default CartTable;
