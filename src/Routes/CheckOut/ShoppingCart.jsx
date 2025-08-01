import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import style from "../../styles/Cart.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import DialogBox from "../../Component/MainComponents/DialogBox";
import { setCart, setCartLoading } from "../../../Store/Slice/UserCartSlice";
import { setCartCount } from "../../../Store/Slice/CountSlice";
import {
  getUserCart,
  UpdateCartTiffins,
  UpdateUserCart,
} from "../../axiosConfig/AxiosConfig";
import { Toast } from "../../Utils/Toast";
import { useNavigate } from "react-router-dom";
import CouponCode from "../../Component/Cards/CouponCode";
import CartCard from "../../Component/Cards/CartCard";
import CartTable from "../../Component/UI-Components/CartTable";
import CartItemCardMobile from "../../Component/UI-Components/CartItemcard";
import NoDataFound from "../../Component/MainComponents/NoDataFound";
import Loading from "../../Component/UI-Components/Loading";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.cart);
  const [dialog, setDialog] = useState({ isOpen: false, product: null });
  const navigate = useNavigate();
  const { cartCount } = useSelector((state) => state.count);
  const [] = useState([]);
  const subtotal = useMemo(() => {
    if (isAuthenticated) {
      return cart?.items?.totalAmount;
    } else {
      return (
        (cart?.items?.items?.reduce(
          (acc, item) =>
            acc +
            (item?.sku?.details?.combinations?.Price || item?.price || 0) *
              item.quantity,
          0
        ) || 0) +
        (cart?.items?.tiffins?.reduce(
          (acc, item) =>
            acc + parseFloat(item.price || 0) * (item.quantity || 1),
          0
        ) || 0)
      );
    }
  }, [cart, isAuthenticated]);

  const total = useMemo(() => {
    if (isAuthenticated) {
      return cart?.items?.grandTotal;
    } else {
      return (
        (cart?.items?.items?.reduce(
          (acc, item) =>
            acc +
            (item?.sku?.details?.combinations?.Price || item?.price || 0) *
              item.quantity,
          0
        ) || 0) +
        (cart?.items?.tiffins?.reduce(
          (acc, item) =>
            acc + parseFloat(item.price || 0) * (item.quantity || 1),
          0
        ) || 0)
      );
    }
  }, [cart, isAuthenticated]);

  const fetchUserCart = async () => {
    try {
      dispatch(setCartLoading(true));
      if (user?.userid) {
        const data = {
          id: user.userid,
        };
        const res = await getUserCart(data);
        dispatch(setCart(res.data.data));
      }
      dispatch(setCartLoading(false));
    } catch (error) {
      console.error("Error fetching user cart:", error);
      Toast({ message: "Failed to load cart!", type: "error" });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    }
  }, [isAuthenticated, cart?.items?.items?.length]);

  const handleShowProduct = (
    identifier,
    type,
    day = null,
    customizedItems = [],
    skuId = null,
    combination = null
  ) => {
    console.log(identifier, type, day, customizedItems, skuId, combination);
    let product;
    let tiffinIndex = -1;
    if (type === "product") {
      product = cart?.items?.items?.find(
        (item) =>
          item._id === identifier &&
          (!skuId || item?.sku?._id === skuId) &&
          (!combination ||
            JSON.stringify(item?.combination) === JSON.stringify(combination))
      );
    } else if (type === "tiffin") {
      tiffinIndex = cart?.items?.tiffins?.findIndex(
        (item) =>
          item.tiffinMenuId === identifier &&
          item.day === day &&
          areCustomizedItemsEqual(
            item.customizedItems || [],
            customizedItems || []
          )
      );
      product = cart?.items?.tiffins?.[tiffinIndex];
      if (product) {
        product = {
          ...product,
          tiffinIndex,
        };
      }
    }

    if (product) {
      setDialog({ isOpen: true, product });
    } else {
      Toast({ message: "Product not found!", type: "error" });
    }
  };

  const updateItemQuantity = async (id, delta, type, options = {}) => {
    try {
      const { day, customizedItems, skuId, combination } = options;

      if (!isAuthenticated) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          tiffins: [],
          items: [],
        };

        const updateQuantity = (array) =>
          array.map((item) => {
            if (type === "tiffin") {
              const isSameTiffin =
                item._id === id &&
                item.day === day &&
                JSON.stringify(item.customizedItems) ===
                  JSON.stringify(customizedItems);

              if (isSameTiffin) {
                const newQuantity = item.quantity + delta;

                if (newQuantity < 1) {
                  Toast({
                    message: "Quantity cannot be less than 1",
                    type: "error",
                  });
                  return item;
                }

                return { ...item, quantity: newQuantity };
              }
            } else if (type === "product") {
              const isSameProduct =
                item._id === id &&
                (!skuId || item?.sku?._id === skuId) &&
                (!combination ||
                  JSON.stringify(item?.combination) ===
                    JSON.stringify(combination));

              if (isSameProduct) {
                const newQuantity = item.quantity + delta;

                if (newQuantity < 1) {
                  Toast({
                    message: "Quantity cannot be less than 1",
                    type: "error",
                  });
                  return item;
                }

                return { ...item, quantity: newQuantity };
              }
            }

            return item;
          });

        let updatedCart = { ...localCart };

        if (type === "product") {
          updatedCart.items = updateQuantity(localCart.items);
        } else if (type === "tiffin") {
          updatedCart.tiffins = updateQuantity(localCart.tiffins);
        } else {
          Toast({ message: "Invalid item type!", type: "error" });
          return;
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
        dispatch(
          setCartCount(updatedCart?.tiffins?.length + updatedCart.items.length)
        );
        Toast({ message: "Quantity updated Successfully!", type: "success" });
      } else {
        let currentItem;
        let newQuantity;
        let data;

        if (type === "product") {
          currentItem = cart?.items?.items?.find((item) => item._id === id);
          if (!currentItem) {
            Toast({ message: "Product not found!", type: "error" });
            return;
          }
          newQuantity = currentItem.quantity + delta;
          data = {
            user_id: user?.userid,
            type: "product",
            product_id: currentItem.product_id,
            quantity: newQuantity,
            skuId: skuId,
            combination,
          };
        } else if (type === "tiffin") {
          currentItem = cart?.items?.tiffins?.find((item) => item._id === id);
          if (!currentItem) {
            Toast({ message: "Tiffin not found!", type: "error" });
            return;
          }
          newQuantity = currentItem.quantity + delta;
          data = {
            user_id: user?.userid,
            type: "tiffin",
            tiffinMenuId: currentItem.tiffinMenuId,
            quantity: newQuantity,
            day: currentItem.day,
            customizedItems: currentItem.customizedItems || [],
          };
        } else {
          Toast({ message: "Invalid item type!", type: "error" });
          return;
        }

        const res = await UpdateUserCart(data);
        dispatch(setCart(res.data.data));
        dispatch(
          setCartCount(
            (res.data.data.items?.items?.length || 0) +
              (res.data.data.items?.tiffins?.length || 0)
          )
        );
        Toast({
          message: "Tiffin Quantity updated Successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Toast({ message: "Failed to update quantity!", type: "error" });
    }
  };

  const areCustomizedItemsEqual = (a = [], b = []) => {
    if (a.length !== b.length) return false;

    return a.every((itemA) =>
      b.some(
        (itemB) =>
          itemA.name === itemB.name &&
          itemA.price === itemB.price &&
          itemA.quantity === itemB.quantity &&
          itemA.included === itemB.included &&
          itemA.weight === itemB.weight &&
          itemA.weightUnit === itemB.weightUnit &&
          itemA.description === itemB.description
      )
    );
  };

  const handleDelete = async (
    identifier,
    type,
    day = null,
    customizedItems = [],
    skuId = null,
    combination = null
  ) => {
    try {
      if (!isAuthenticated) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          tiffins: [],
          items: [],
        };

        let updatedCart = { ...localCart };

        if (type === "product") {
          updatedCart.items = localCart.items.filter(
            (item) =>
              !(
                item._id === identifier &&
                (!skuId || item?.sku?._id === skuId) &&
                (!combination ||
                  JSON.stringify(item?.combination) ===
                    JSON.stringify(combination))
              )
          );
        } else if (type === "tiffin") {
          updatedCart.tiffins = localCart.tiffins.filter(
            (item) =>
              !(
                item.tiffinMenuId === identifier &&
                item.day === day &&
                areCustomizedItemsEqual(
                  item.customizedItems || [],
                  customizedItems || []
                )
              )
          );
        } else {
          Toast({ message: "Invalid item type!", type: "error" });
          return;
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
        dispatch(
          setCartCount(updatedCart.tiffins.length + updatedCart.items.length)
        );
        Toast({ message: "Removed from cart!", type: "success" });
      } else {
        let data = {
          user_id: user?.userid,
          type,
          quantity: 0,
          skuId,
          combination,
        };
        if (type === "product") {
          const productItem = cart?.items?.items?.find(
            (item) => item._id === identifier
          );

          if (!productItem) {
            Toast({ message: "Product not found!", type: "error" });
            return;
          }
          data.product_id = productItem.product_id;
        } else if (type === "tiffin") {
          const tiffinItem = cart?.items?.tiffins?.find(
            (item) =>
              item.tiffinMenuId === identifier &&
              item.day === day &&
              areCustomizedItemsEqual(
                item.customizedItems || [],
                customizedItems || []
              )
          );

          if (!tiffinItem) {
            Toast({ message: "Tiffin not found!", type: "error" });
            return;
          }

          data.tiffinMenuId = tiffinItem.tiffinMenuId;
          data.day = tiffinItem.day;
          data.customizedItems = tiffinItem.customizedItems || [];
        } else {
          Toast({ message: "Invalid item type!", type: "error" });
          return;
        }

        const res = await UpdateUserCart(data);
        dispatch(setCart(res.data.data));
        dispatch(
          setCartCount(
            (res.data.data.items?.items?.length || 0) +
              (res.data.data.items?.tiffins?.length || 0)
          )
        );
        Toast({ message: "Removed from cart!", type: "success" });
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      Toast({ message: "Failed to remove item!", type: "error" });
    }
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      Toast({ message: "Please login to checkout!", type: "error" });
    } else {
      navigate("/checkout");
    }
  };

  if (
    (isAuthenticated &&
      !cart?.items?.items?.length &&
      !cart?.items?.tiffins?.length) ||
    (!isAuthenticated &&
      !cart?.items?.items?.length &&
      !cart?.items?.tiffins?.length)
  ) {
    return (
      <div>
        <Header />
        <Banner name="CART" />
        <div className={style.notFound}>
          <NoDataFound message="Your cart is empty" />
        </div>
        <Footer />
      </div>
    );
  }

  const UpdateCustomizeTiffinItems = async () => {
    try {
      const updatedProduct = dialog.product;
      const isEqual = (a = [], b = []) => {
        if (a.length !== b.length) return false;
        return a.every((itemA) =>
          b.some(
            (itemB) =>
              itemA.itemId === itemB.itemId &&
              itemA.name === itemB.name &&
              itemA.price === itemB.price
          )
        );
      };

      if (!isAuthenticated) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          tiffins: [],
          items: [],
        };

        const updatedTiffins = localCart.tiffins.map((item, index) => {
          // Update only the tiffin at the specific index
          if (index === updatedProduct.tiffinIndex) {
            const updatedCustomizedItems = updatedProduct.customizedItems || [];

            const newPrice = updatedCustomizedItems.reduce((acc, curr) => {
              const price = parseFloat(curr.price || 0);
              const quantity = parseInt(curr.quantity || 1);
              return acc + price * quantity;
            }, 0);

            return {
              ...item,
              customizedItems: updatedCustomizedItems,
              price: newPrice.toFixed(2),
            };
          }

          return item;
        });

        const updatedCart = {
          ...localCart,
          tiffins: updatedTiffins,
        };

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        dispatch(setCart(updatedCart));
        dispatch(
          setCartCount(updatedCart.items.length + updatedCart.tiffins.length)
        );

        Toast({
          message: "Customized items updated locally!",
          type: "success",
        });

        setDialog({ isOpen: false, product: null });
      } else {
        dispatch(setCartLoading(true));
        const data = {
          user_id: user?.userid,
          tiffinMenuId: dialog.product?.tiffinMenuId,
          day: dialog.product?.day,
          customizedItems: dialog.product?.customizedItems,
        };
        const res = await UpdateCartTiffins(data);
        dispatch(setCart(res.data.data));
        dispatch(
          setCartCount(
            (res.data.data.items?.items?.length || 0) +
              (res.data.data.items?.tiffins?.length || 0)
          )
        );

        setDialog({ isOpen: false, product: null });
        Toast({
          message: "Customized items updated successfully!",
          type: "success",
        });
        dispatch(setCartLoading(false));
      }
    } catch (error) {
      console.log(error);
      Toast({
        message: "Failed to update customized tiffin items",
        type: "error",
      });
    }
  };

  const handleCustomizedItemQuantityChange = (index, delta) => {
    const updatedItems = [...dialog.product.customizedItems];
    let newQty = parseInt(updatedItems[index].quantity || 1) + delta;

    if (newQty < 0) {
      Toast({ message: "Quantity cannot be less than 0", type: "error" });
      return;
    }

    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQty.toString(),
    };

    setDialog((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        customizedItems: updatedItems,
      },
    }));
  };

  const isCustomized =
    dialog?.product?.tiffinMenuDetails?.isCustomized ||
    dialog?.product?.isCustomized;

  console.log(dialog.product);

  return (
    <div>
      <Header />
      <Banner name="CART" />
      <div className={style.cartContainer}>
        <div className={style.desktopCartView}>
          {loading ? (
            <div>
              <Loading />
            </div>
          ) : (
            <CartTable
              items={cart?.items?.items || []}
              tiffins={cart?.items?.tiffins || []}
              isAuthenticated={isAuthenticated}
              onDelete={handleDelete}
              onUpdateQuantity={updateItemQuantity}
              onShowProduct={handleShowProduct}
            />
          )}
        </div>

        <div className={style.mobileCartView}>
          {(cart?.items?.items || []).map((item, index) => (
            <CartItemCardMobile
              key={index}
              item={{
                image: isAuthenticated
                  ? item?.productDetails?.images?.[0]?.url
                  : item?.images?.[0]?.url,
                name: isAuthenticated ? item?.productDetails?.name : item?.name,
                price:
                  item?.sellingPrice ||
                  item?.sku?.details?.combinations?.Price ||
                  item?.price,
                quantity: item.quantity,
                description: isAuthenticated
                  ? item?.productDetails?.shortDescription
                  : item?.shortDescription,
              }}
              type="product"
              onIncrease={() =>
                updateItemQuantity(item._id, 1, "product", {
                  skuId: item?.sku?._id,
                  combination: item?.combination,
                })
              }
              onDecrease={() =>
                updateItemQuantity(item._id, -1, "product", {
                  skuId: item?.sku?._id,
                  combination: item?.combination,
                })
              }
            />
          ))}

          {(cart?.items?.tiffins || []).map((item, index) => (
            <CartItemCardMobile
              key={index}
              item={{
                items: item,
                image: isAuthenticated
                  ? item?.tiffinMenuDetails?.image_url?.[0]?.url ||
                    "/defaultImage.png"
                  : item?.image_url[0]?.url || "/defaultImage.png",
                name: isAuthenticated
                  ? item?.tiffinMenuDetails?.name
                  : item.name,
                price: isAuthenticated
                  ? item?.tiffinMenuDetails?.totalAmount
                  : item?.price,
                day: item?.day,
                quantity: item.quantity,
                type: "tiffin",
                description: item?.tiffinMenuDetails?.shortDescription || "",
              }}
              onDelete={handleDelete}
              onShowProduct={handleShowProduct}
              type="tiffin"
              onIncrease={() =>
                updateItemQuantity(item._id, 1, "tiffin", {
                  day: item.day,
                  customizedItems: item.customizedItems,
                })
              }
              onDecrease={() =>
                updateItemQuantity(item._id, -1, "tiffin", {
                  day: item.day,
                  customizedItems: item.customizedItems,
                })
              }
            />
          ))}
        </div>
        <div className={style.cartSummary}>
          <div>
            <CouponCode data={cart} />
          </div>
          <div className={style.cartTotals}>
            <CartCard
              itemCount={cartCount}
              subtotal={subtotal}
              total={total}
              couponCode={cart.items.couponCode}
              discount={cart.items.discount}
              handleClick={handleClick}
            />
          </div>
        </div>
      </div>
      <Footer />

      <DialogBox
        isOpen={dialog.isOpen}
        title="Product Detail"
        onClose={() => setDialog({ isOpen: false, product: null })}
      >
        {dialog.product && (
          <div className={style.productDetail}>
            <div className={style.productImage}>
              <img
                src={
                  dialog.product?.sku?.images?.[0] ||
                  dialog.product.productDetails.images[0].url ||
                  dialog.product?.tiffinMenuDetails?.image_url?.[0]?.url ||
                  dialog.product?.image_url?.[0]?.url ||
                  "/defaultImage.png"
                }
                alt="product"
              />
            </div>

            <div className={style.productInfo}>
              <h2>
                {dialog.product?.productDetails?.name ||
                  dialog.product?.name ||
                  dialog.product?.tiffinMenuDetails?.name ||
                  "Tiffin Item"}
              </h2>

              <div className={style.productPricing}>
                <span className="Price">
                  $
                  {dialog.product?.price ||
                    dialog.product?.sellingPrice ||
                    dialog.product?.totalAmount ||
                    dialog.product?.tiffinMenuDetails?.totalAmount ||
                    0}{" "}
                  CAD
                </span>
              </div>

              {(dialog.product?.productDetails?.category ||
                dialog.product?.category) && (
                <p className={style.productDescription}>
                  Category:{" "}
                  {isAuthenticated
                    ? dialog.product?.productDetails?.category
                    : dialog.product?.category}
                </p>
              )}

              {(dialog.product?.productDetails?.subCategory ||
                dialog.product?.subCategory) && (
                <p className={style.productDescription}>
                  SubCategory:{" "}
                  {isAuthenticated
                    ? dialog.product?.productDetails?.subCategory
                    : dialog.product?.subCategory}
                </p>
              )}

              {(dialog.product?.productDetails?.ProductCategory ||
                dialog.product?.ProductCategory) && (
                <p className={style.productDescription}>
                  Product:{" "}
                  {isAuthenticated
                    ? dialog.product?.productDetails?.ProductCategory
                    : dialog.product?.ProductCategory}
                </p>
              )}

              {dialog.product?.tiffinMenuDetails?.description && (
                <p className={style.productDescription}>
                  {dialog.product?.tiffinMenuDetails?.description}
                </p>
              )}

              {dialog.product?.day && (
                <p className={style.productDescription}>
                  Day: {dialog.product.day}
                </p>
              )}

              {dialog.product?.quantity && (
                <p className={style.productDescription}>
                  Quantity: {dialog.product.quantity}
                </p>
              )}

              {isCustomized > 0 ? (
                <>
                  <div>
                    <ul>
                      {dialog.product?.customizedItems?.length > 0 && (
                        <>
                          <div>
                            <span>Items:</span>
                            <ul>
                              {dialog.product.customizedItems.map(
                                (item, index) => (
                                  <li
                                    className={style.customizedItems}
                                    key={item._id || index}
                                  >
                                    {item.name}
                                    <div className={style.quantity}>
                                      <button
                                        className={style.quantityButton}
                                        onClick={() =>
                                          handleCustomizedItemQuantityChange(
                                            index,
                                            -1
                                          )
                                        }
                                      >
                                        -
                                      </button>

                                      <input
                                        type="number"
                                        min={1}
                                        className={style.quantityInput}
                                        value={item.quantity}
                                        readOnly
                                      />

                                      <button
                                        className={style.quantityButton}
                                        onClick={() =>
                                          handleCustomizedItemQuantityChange(
                                            index,
                                            1
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>

                                    {item.weight && item.weightUnit && (
                                      <span>
                                        {" "}
                                        {item.weight} {item.weightUnit}
                                      </span>
                                    )}
                                    <span> - ${item.price} CAD</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className={style.updateButtonWrap}>
                    <button
                      className="Button sm"
                      onClick={UpdateCustomizeTiffinItems}
                    >
                      Update Tiffin Items
                    </button>
                  </div>
                </>
              ) : (
                <ul>
                  {dialog?.product?.customizedItems?.map((item, index) => (
                    <li className={style.customizedItems} key={index}>
                      {item.name} - {item.quantity} - ${item.price} CAD
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogBox>
    </div>
  );
};

export default ShoppingCart;
