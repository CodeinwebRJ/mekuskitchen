import { useState } from "react";
import style from "../../styles/Cart.module.css";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { UpdateUserCart } from "../../axiosConfig/AxiosConfig";
import Button from "../../Component/Buttons/Button";
import { RxCross2 } from "react-icons/rx";
import EmptyCartPage from "./EmptyCartPage";
import { Link } from "react-router-dom";
import { FaMinus, FaPlus, FaEye } from "react-icons/fa";
import DialogBox from "../../Component/DialogBox";
import Chip from "../../Component/Buttons/Chip";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const [showProduct, setShowProduct] = useState(false);
  const [productData, setProductData] = useState(null);
  const User = useSelector((state) => state.auth.user);
  const Cart = useSelector((state) => state.cart);
  const taxRate = 0.05;

  const handleShowProduct = (id) => {
    const product = Cart?.items?.items?.find((item) => item._id === id);
    setProductData(product);
    setShowProduct(true);
  };

  const updateItemQuantity = async (id, delta, type, dayName = null) => {
    try {
      let currentItem;
      let newQuantity;
      let data;

      if (type === "product") {
        currentItem = Cart?.items?.items?.find((item) => item._id === id);
        if (!currentItem) return;

        newQuantity = currentItem.quantity + delta;
        if (newQuantity < 1) return;

        data = {
          user_id: User?.userid,
          type: "product",
          product_id: currentItem.product_id,
          quantity: newQuantity,
        };
      } else if (type === "tiffin") {
        currentItem = Cart?.items?.tiffins?.find((item) => item._id === id);
        if (!currentItem) return;

        newQuantity = currentItem.quantity + delta;
        if (newQuantity < 1) return;

        data = {
          user_id: User?.userid,
          type: "tiffin",
          tiffinMenuId: currentItem.tiffinMenuId,
          quantity: newQuantity,
          day: dayName,
        };
      } else {
        return;
      }

      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDelete = async (id, type, dayName = null) => {
    try {
      const data = {
        user_id: User?.userid,
        type: type,
        quantity: 0,
        product_id: type === "product" ? id : undefined,
        tiffinMenuId: type === "tiffin" ? id : undefined,
        day: type === "tiffin" ? dayName : undefined,
      };

      const res = await UpdateUserCart(data);
      dispatch(setCart(res.data.data));
    } catch (error) {
      console.error("Error deleting item from cart", error);
    }
  };

  const subtotal =
    (Cart?.items?.items?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0) +
    (Cart?.items?.tiffins?.reduce(
      (acc, item) => acc + item.tiffinMenuDetails?.totalAmount * item.quantity,
      0
    ) || 0);

  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <>
      <div>
        <Header />
        <Banner name={"CART"} />

        {Cart?.items?.items?.length > 0 || Cart?.items?.tiffins?.length > 0 ? (
          <div className={style.cartContainer}>
            <div className={style.cartItems}>
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
                  {Cart?.items?.items?.map((item, index) => (
                    <tr key={index} className={style.cartItem}>
                      <td>
                        <div className={style.removeCell}>
                          <RxCross2
                            className={style.removeIcon}
                            onClick={() =>
                              handleDelete(item.product_id, "product")
                            }
                          />
                          <FaEye onClick={() => handleShowProduct(item._id)} />
                        </div>
                      </td>
                      <td>
                        <div className={style.productCell}>
                          <img
                            src={item?.productDetails?.images[0].url}
                            alt="product"
                            className={style.cartItemImage}
                          />
                          <span>{item?.productDetails?.name}</span>
                        </div>
                      </td>
                      <td>${item?.price}</td>
                      <td>
                        <div className={style.quantityControl}>
                          <button
                            onClick={() =>
                              updateItemQuantity(item._id, -1, "product")
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className={style.quantity}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(item._id, 1, "product")
                            }
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className={style.totalPrice}>
                        ${item.price * item.quantity}
                      </td>
                    </tr>
                  ))}

                  {Cart?.items?.tiffins?.map((tiffin, index) => (
                    <tr key={index} className={style.cartItem}>
                      <td>
                        <RxCross2
                          className={style.removeIcon}
                          onClick={() =>
                            handleDelete(
                              tiffin.tiffinMenuId,
                              "tiffin",
                              tiffin.day
                            )
                          }
                        />
                      </td>
                      <td>
                        <div className={style.productCell}>
                          <img
                            src={
                              tiffin.tiffinMenuDetails?.image_url?.[0]?.url ||
                              "/defultImage.png"
                            }
                            alt="tiffin"
                            className={style.cartItemImage}
                          />
                          <span>{tiffin?.day}</span>
                        </div>
                      </td>
                      <td>${tiffin.tiffinMenuDetails?.totalAmount}</td>
                      <td>
                        <div className={style.quantityControl}>
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                tiffin._id,
                                -1,
                                "tiffin",
                                tiffin.day
                              )
                            }
                            disabled={tiffin.quantity <= 1}
                          >
                            -
                          </button>
                          <span className={style.quantity}>
                            {tiffin.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                tiffin._id,
                                1,
                                "tiffin",
                                tiffin.day
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className={style.totalPrice}>
                        $
                        {tiffin.tiffinMenuDetails?.totalAmount *
                          tiffin.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={style.cartTotals}>
              <h3>Cart Totals</h3>
              <p>
                Subtotal: <span>${subtotal.toFixed(2)}</span>
              </p>
              <hr />
              <p>
                Shipping: <span>Self Pickup</span>
              </p>
              <hr />
              <p>
                Shipping to: <strong>Calgary, AB</strong>
              </p>
              <hr />
              <p>
                Tax: <span className={style.taxAmount}>${tax.toFixed(2)}</span>
              </p>
              <hr />
              <p className={style.total}>
                Total:{" "}
                <span className={style.totalAmount}>${total.toFixed(2)}</span>
              </p>

              <Link to="/checkout" state={{ id: "123" }}>
                <div className={style.checkoutButton}>
                  <Button variant="success" size="md">
                    Proceed to Checkout
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <EmptyCartPage />
        )}
        <Footer />
      </div>

      <DialogBox
        isOpen={showProduct}
        title="Product Detail"
        onClose={() => setShowProduct(false)}
      >
        <div className={style.productDetail}>
          <div className={style.productImage}>
            <img src={productData?.productDetails?.images[0]?.url} />
          </div>
          <div className={style.productInfo}>
            <h2>{productData?.productDetails?.name}</h2>

            <div className={style.productPricing}>
              <span className={style.originalPrice}>
                ${productData?.productDetails?.price}
              </span>
              <span className={style.sellingPrice}>
                ${productData?.productDetails?.sellingPrice}
              </span>
            </div>
            <p className={style.productDescription}>
              Category : {productData?.productDetails?.category}
            </p>
            {productData?.productDetails?.subCategory && (
              <p className={style.productDescription}>
                Product : {productData?.productDetails?.subCategory}
              </p>
            )}
            {productData?.productDetails?.subSubCategory && (
              <p className={style.productDescription}>
                Product : {productData?.productDetails?.subSubCategory}
              </p>
            )}
            <div>
              <Chip name={"AddCart"} />
            </div>
            <p className={style.productDescription}>
              {productData?.productDetails?.shortDescription}
            </p>
          </div>
        </div>
      </DialogBox>
    </>
  );
};

export default ShoppingCart;
