import { useEffect, useMemo, useState, useCallback } from "react";
import style from "../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Footer from "../../Component/MainComponents/Footer";
import TiffinRelatedProduct from "./TiffinRelatedProduct";
import Header from "../../Component/MainComponents/Header";
import Tabs from "../../Component/UI-Components/Tabs";
import Chip from "../../Component/Buttons/Chip";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { Toast } from "../../Utils/Toast";
import ImageGallery from "../ProductPage/ImageGallary";
import ReviewComponent from "../ProductPage/ReviewComponent";
import Loading from "../../Component/UI-Components/Loading";
import RatingStar from "../../Component/RatingStar";
import { getDatesForDayInRange } from "../../Utils/DateDayRange";
import { formatDate } from "../../Utils/FormateDate";

const getTabData = (
  product,
  reviews,
  rating,
  review,
  setReview,
  setRating,
  setReviews,
  id
) => {
  const data = [
    {
      label: "Description",
      content: <div>{product?.description || "No description available."}</div>,
    },
    {
      label: "Reviews",
      content: (
        <ReviewComponent
          reviews={reviews}
          setReviews={setReviews}
          product={product}
          rating={rating}
          review={review}
          id={id}
          setReview={setReview}
          setRating={setRating}
        />
      ),
    },
  ];

  if (product?.specifications) {
    data.unshift({
      label: "Specifications",
      content: (
        <div>
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key}>
              <strong>{key}: </strong>
              {value}
            </div>
          ))}
        </div>
      ),
    });
  }
  return data;
};

const TiffinProductPage = () => {
  const location = useLocation();
  const id = location.state?.id;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { tiffins: products = [], loading } = useSelector(
    (state) => state.tiffin
  );
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const product = useMemo(
    () => products.find((p) => p._id === id),
    [id, products]
  );
  const [quantities, setQuantities] = useState({ main: 1, items: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product) {
      const { image_url, items } = product;
      setSelectedImage(image_url?.[0]?.url || null);
      setQuantities({
        main: 1,
        items:
          items?.map(({ _id, name, price }) => ({
            itemId: _id,
            name,
            price,
            quantity: 1,
          })) || [],
      });
    }
  }, [product]);

  const handleMainQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantities((prev) => ({
      ...prev,
      main: isNaN(value) || value < 1 ? 1 : value,
    }));
  };

  const updateItemQuantity = (index, delta) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ),
    }));
  };

  const customTotalPrice = useMemo(() => {
    const itemsTotal = quantities.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal;
  }, [quantities, product]);

  const handleItemInputChange = (index, value) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(0, value) } : item
      ),
    }));
  };

  const isExpired = useMemo(() => {
    if (!product?.endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(product.endDate);
    end.setHours(0, 0, 0, 0);
    return end < today;
  }, [product]);

  const areItemsEqual = (items1, items2) => {
    if (items1.length !== items2.length) return false;

    console.log(items1, items2);
    const sorted1 = [...items1].sort((a, b) =>
      a.itemId.localeCompare(b.itemId)
    );
    const sorted2 = [...items2].sort((a, b) =>
      a.itemId.localeCompare(b.itemId)
    );

    return sorted1.every((item, i) => {
      const other = sorted2[i];
      return (
        item._id === other._id &&
        parseInt(item.quantity) === parseInt(other.quantity)
      );
    });
  };

  const handleSubmit = async () => {
    const selectedItems = quantities.items.filter((item) => item.quantity > 0);
    if (selectedItems.length === 0) {
      Toast({ message: "Please select at least one item", type: "warn" });
      return;
    }
    const orderDate = new Date().toISOString().split("T")[0];
    const tiffinData = {
      _id: product._id,
      tiffinMenuId: id,
      name: product.name,
      image_url: product.image_url,
      day: product.day,
      deliveryDate: product.date,
      isCustomized: true,
      customizedItems: selectedItems,
      quantity: quantities.main,
      price: customTotalPrice,
      specialInstructions: "NA",
      orderDate,
    };
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
        tiffins: [],
      };

      const existingIndex = localCart.tiffins.findIndex(
        (t) =>
          t.tiffinMenuId === id &&
          areItemsEqual(t.customizedItems, selectedItems)
      );
      let updatedTiffins;

      if (existingIndex !== -1) {
        updatedTiffins = localCart.tiffins.map((tiffin, index) => {
          if (index === existingIndex) {
            return {
              ...tiffin,
              quantity: tiffin.quantity + quantities.main,
              price: parseFloat(tiffin.price || 0)
                // parseFloat( || 0)
                .toFixed(2),
            };
          }
          return tiffin;
        });
        Toast({ message: "Tiffin quantity updated in cart", type: "success" });
      } else {
        updatedTiffins = [...localCart.tiffins, tiffinData];
        Toast({ message: "Customized tiffin added to cart", type: "success" });
      }
      const updatedCart = {
        ...localCart,
        tiffins: updatedTiffins,
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
      return;
    }
    try {
      const data = {
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: id,
        customizedItems: selectedItems,
        specialInstructions: "NA",
        orderDate,
        day: product.day,
        deliveryDate: product.date,
        quantity: quantities.main,
        price: customTotalPrice,
      };

      const res = await AddtoCart(data);
      dispatch(setCart(res?.data?.data));
      Toast({ message: "Tiffin added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding tiffin:", error);
      Toast({ message: "Failed to add tiffin to cart", type: "error" });
    }
  };

  if (loading || !product) return <Loading />;

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.productLayout}>
          <ImageGallery
            product={{ images: product.image_url }}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className={style.productDetails}>
            <h5>{product.name}</h5>

            <div className={style.ratingContainer}>
              <RatingStar rating={4} disabled />
              <span>({reviews?.length || 0})</span>
            </div>

            <div className={style.priceContainer}>
              <span className="price">${customTotalPrice.toFixed(2)}</span>
            </div>

            {product.category && (
              <div className={style.categoryContainer}>
                Category:{" "}
                <span className={style.category}>{product.category}</span>
              </div>
            )}
            {product.category && (
              <div className={style.categoryContainer}>
                Day:{" "}
                <span className={style.category}>
                  {product.day.toUpperCase()}
                </span>
              </div>
            )}
            {product.date && (
              <div className={style.categoryContainer}>
                Date:{" "}
                <span className={style.category}>
                  {formatDate(product.date)}
                </span>
              </div>
            )}
            {product.endDate && (
              <div className={style.categoryContainer}>
                Booking End Date:{" "}
                <span className={style.category}>
                  {formatDate(product.endDate)}
                </span>
              </div>
            )}

            {product.isCustomized === true && (
              <div className={style.itemsContainer}>
                {product.items?.map((item, index) => (
                  <div className={style.items} key={item._id}>
                    <div>{index + 1}.</div>
                    <div>{item.name}</div>
                    <div>${item.price}</div>
                    {location.state.isReg === "" && <div>{item.quantity}</div>}
                    <div>
                      {item.weight} {item.weightUnit || ""}
                    </div>
                    {location.state.isReg === "cust" && (
                      <div className={style.quantity}>
                        <button
                          onClick={() => updateItemQuantity(index, -1)}
                          className={style.quantityButton}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantities.items[index]?.quantity || 0}
                          onChange={(e) =>
                            handleItemInputChange(
                              index,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className={style.quantityInput}
                          min={0}
                        />
                        <button
                          onClick={() => updateItemQuantity(index, 1)}
                          className={style.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className={style.quantity}>
              <button
                onClick={() =>
                  setQuantities((prev) => ({
                    ...prev,
                    main: Math.max(1, prev.main - 1),
                  }))
                }
                className={style.quantityButton}
              >
                -
              </button>
              <input
                type="number"
                value={quantities.main}
                onChange={handleMainQuantityChange}
                className={style.quantityInput}
                min="1"
              />
              <button
                onClick={() =>
                  setQuantities((prev) => ({ ...prev, main: prev.main + 1 }))
                }
                className={style.quantityButton}
              >
                +
              </button>
              <div className={style.addToCartContainer}>
                <button
                  onClick={handleSubmit}
                  className="Button sm"
                  disabled={isExpired}
                  style={
                    isExpired ? { cursor: "not-allowed", opacity: 0.5 } : {}
                  }
                >
                  {"ADD TO CART"}
                </button>
              </div>
            </div>

            {product.tags?.length > 0 && (
              <div className={style.Chip}>
                <h6>Tags:</h6>
                {product.tags.map((tag) => (
                  <Chip key={tag} name={tag} />
                ))}
              </div>
            )}

            <div className={style.share}>
              Share:
              <div className={style.socialIcons}>
                <img src="/facebook.png" alt="Facebook" />
                <img src="/instagram.png" alt="Instagram" />
              </div>
            </div>
          </div>
        </div>

        <Tabs
          tabs={getTabData(
            product,
            reviews,
            rating,
            review,
            setReview,
            setRating,
            setReviews,
            id
          )}
        />
      </div>

      <TiffinRelatedProduct />
      <Footer />
    </div>
  );
};

export default TiffinProductPage;
