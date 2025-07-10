import { useEffect, useMemo, useState, useCallback } from "react";
import style from "../../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../Component/MainComponents/Footer";
import TiffinRelatedProduct from "./TiffinRelatedProduct";
import Header from "../../../Component/MainComponents/Header";
import Tabs from "../../../Component/UI-Components/Tabs";
import Chip from "../../../Component/Buttons/Chip";
import { AddtoCart } from "../../../axiosConfig/AxiosConfig";
import { setCart } from "../../../../Store/Slice/UserCartSlice";
import { Toast } from "../../../Utils/Toast";
import ImageGallery from "../../ProductPage/ImageGallary";
import ReviewComponent from "../../ProductPage/ReviewComponent";
import Loading from "../../../Component/UI-Components/Loading";
import RatingStar from "../../../Component/RatingStar";
import { getDatesForDayInRange } from "../../../Utils/DateDayRange";

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
  const { user } = useSelector((state) => state.auth);
  const { tiffins: products = [], loading } = useSelector(
    (state) => state.tiffin
  );
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useMemo(
    () => products.find((p) => p._id === id),
    [id, products]
  );
  const currentIndex = products.findIndex((p) => p._id === id);
  const [quantities, setQuantities] = useState({ main: 1, items: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [validDates, setValidDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (product?.date && product?.endDate && product?.day) {
      const matchingDates = getDatesForDayInRange(
        product.date,
        product.endDate,
        product.day
      );
      setValidDates(matchingDates);
    }
  }, [product]);

  useEffect(() => {
    if (validDates.length > 0 && !selectedDate) {
      setSelectedDate(validDates[0]);
    }
  }, [validDates, selectedDate]);

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

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(location.pathname, {
        state: { id: products[currentIndex - 1]._id },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      navigate(location.pathname, {
        state: { id: products[currentIndex + 1]._id },
      });
    }
  };

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

  const handleItemInputChange = (index, value) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(0, value) } : item
      ),
    }));
  };

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const handleSubmit = async () => {
    const selectedItems = quantities.items.filter((item) => item.quantity > 0);

    if (cart?.items?.items?.length > 0) {
      Toast({ message: "Cart already contains items.", type: "error" });
      return;
    }

    if (selectedItems.length === 0) {
      Toast({ message: "Please select at least one item", type: "warn" });
      return;
    }

    const orderDate = new Date().toISOString().split("T")[0];

    try {
      const data = {
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: id,
        customizedItems: selectedItems,
        specialInstructions: "No onions",
        orderDate,
        day: product.day,
        deliveryDate: selectedDate,
        quantity: quantities.main,
        price: product.totalAmount,
      };
      const res = await AddtoCart(data);
      dispatch(setCart(res?.data?.data));
      Toast({ message: "Tiffin added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add tiffin to cart", type: "error" });
    }
  };

  if (loading || !product) return <Loading />;

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
              aria-label="Previous tiffin"
            >
              <img
                src="/nextArrow.png"
                className={style.navIconPrev}
                alt="Prev"
              />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products.length - 1}
              className={style.navButton}
              aria-label="Next tiffin"
            >
              <img
                src="/nextArrow.png"
                className={style.navIconNext}
                alt="Next"
              />
            </button>
          </div>
        </div>

        <div className={style.productLayout}>
          <ImageGallery
            product={{ images: product.image_url }}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className={style.productDetails}>
            <h5>{product.day.toUpperCase()}</h5>

            <div className={style.ratingContainer}>
              <RatingStar rating={4} disabled />
              <span>({reviews?.length || 0})</span>
            </div>

            <div className={style.priceContainer}>
              <span className="price">${product.totalAmount}</span>
            </div>

            {product.category && (
              <div className={style.categoryContainer}>
                Category:{" "}
                <span className={style.category}>{product.category}</span>
              </div>
            )}

            {validDates.length > 0 && (
              <div className={style.dateList}>
                <h6>Available on {product.day}s:</h6>
                <div className={style.dateButtonContainer}>
                  {validDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      className={`${style.dateButton} ${
                        selectedDate === date ? style.selectedDate : ""
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={style.itemsContainer}>
              {product.items?.map((item, index) => (
                <div className={style.items} key={item._id}>
                  <div>{index + 1}.</div>
                  <div>{item.name}</div>
                  <div>${item.price}</div>
                  <div>
                    {item.weight} {item.weightUnit || ""}
                  </div>
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
                </div>
              ))}
            </div>

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
                <button onClick={handleSubmit} className="Button sm">
                  ADD TO CART
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
                <Link to="#">
                  <img src="/facebook.png" alt="Facebook" />
                </Link>
                <Link to="#">
                  <img src="/instagram.png" alt="Instagram" />
                </Link>
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
