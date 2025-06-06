import React, { useEffect, useMemo, useState } from "react";
import style from "../../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLinkedinIn,
} from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import Footer from "../../../Component/MainComponents/Footer";
import TiffinReviewComponent from "./TiffinReviewComponent";
import TiffinRelatedProduct from "./TiffinRelatedProduct";
import Button from "../../../Component/Buttons/Button";
import Header from "../../../Component/MainComponents/Header";
import Tabs from "../../../Component/UI-Components/Tabs";
import Chip from "../../../Component/Buttons/Chip";
import { AddtoCart } from "../../../axiosConfig/AxiosConfig";
import { setCart } from "../../../../Store/Slice/UserCartSlice";
import { Toast } from "../../../Utils/Toast";

const useProductNavigation = (products, currentIndex) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      navigate(location.pathname, {
        state: { id: products[currentIndex + 1]._id },
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(location.pathname, {
        state: { id: products[currentIndex - 1]._id },
      });
    }
  };

  return { handleNext, handlePrev };
};

const ProductImageGallery = ({
  images = [],
  selectedImage,
  setSelectedImage,
  productName,
}) => (
  <div className={style.imageContainer}>
    <div className={style.productImageContainer}>
      <img
        src={selectedImage?.url || "/defaultImage.png"}
        alt={productName}
        className={style.productImage}
      />
    </div>
    <div className={style.thumbnailsContainer}>
      {images.slice(0, 4).map((image, index) => (
        <img
          key={image._id || index}
          src={image.url}
          alt={`${productName} thumbnail ${index + 1}`}
          className={`${style.thumbnail} ${
            selectedImage?._id === image._id ? style.selectedThumbnail : ""
          }`}
          onClick={() => setSelectedImage(image)}
        />
      ))}
    </div>
  </div>
);

const ItemQuantitySelector = ({
  item,
  index,
  quantities,
  handleItemDecrease,
  handleItemInputChange,
  handleItemIncrease,
}) => (
  <div className={style.items} key={item._id}>
    <div className={style.itemNo}>{index + 1}.</div>
    <div className={style.itemName}>{item.name}</div>
    <div className={style.itemPrice}>${item.price}</div>
    <div className={style.itemQuantity}>
      <button
        onClick={() => handleItemDecrease(index)}
        className={style.quantityButton}
        aria-label={`Decrease quantity for ${item.name}`}
        disabled={quantities.items[index]?.quantity <= 0}
      >
        -
      </button>
      <input
        type="number"
        value={quantities.items[index]?.quantity ?? 1}
        onChange={(e) =>
          handleItemInputChange(index, parseInt(e.target.value, 10))
        }
        min="0"
        className={style.quantityInput}
        aria-label={`Quantity for ${item.name}`}
      />
      <button
        onClick={() => handleItemIncrease(index)}
        className={style.quantityButton}
        aria-label={`Increase quantity for ${item.name}`}
      >
        +
      </button>
    </div>
    <div className={style.itemQuantityUnit}>
      {(item?.quantityUnit || "").toUpperCase()}
    </div>
    <div>{item?.weight ? `(${item.weight})` : ""}</div>
  </div>
);

const TiffinProductPage = () => {
  const location = useLocation();
  const id = location.state?.id;

  const { user } = useSelector((state) => state.auth);
  const tiffin = useSelector((state) => state.tiffin);
  const cart = useSelector((state) => state.cart);
  const products = tiffin.tiffins || [];

  const loading = tiffin.loading;

  const product = useMemo(
    () => products.find((p) => p._id === id) || null,
    [id, products]
  );

  const [quantities, setQuantities] = useState({ main: 1, items: [] });
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (product) {
      const firstImage = product.image_url?.[0];
      setSelectedImage(firstImage || null);
      setQuantities({
        main: 1,
        items:
          product.items?.map((item) => ({
            itemId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
          })) || [],
      });
    }
  }, [product]);

  const currentIndex = products.findIndex((p) => p._id === id);
  const { handleNext, handlePrev } = useProductNavigation(
    products,
    currentIndex
  );

  const handleMainQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantities((prev) => ({
      ...prev,
      main: isNaN(value) || value < 1 ? 1 : value,
    }));
  };

  const handleItemDecrease = (index) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ),
    }));
  };

  const handleItemInputChange = (index, value) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, quantity: isNaN(value) ? 0 : Math.max(0, value) }
          : item
      ),
    }));
  };

  const handleItemIncrease = (index) => {
    setQuantities((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }));
  };

  const productItems = quantities.items.filter((item) => item.quantity > 0);

  const handleSubmit = async () => {
    
    if (cart?.items?.items?.length > 0) {
      Toast({
        message: "Cannot add tiffin - cart already contains items",
        type: "error",
      });
      return;
    }

    if (productItems.length === 0) {
      Toast({
        message: "Please select at least one item",
        type: "warn",
      });
      return;
    }

    try {
      const data = {
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: id,
        customizedItems: productItems,
        specialInstructions: "No onions, please.",
        orderDate: new Date().toISOString().split("T")[0],
        day: product.day,
        quantity: quantities.main,
        price: product.subTotal,
      };

      const res = await AddtoCart(data);
      dispatch(setCart(res?.data?.data));
      Toast({
        message: "Tiffin added to cart successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({
        message: "Failed to add tiffin to cart",
        type: "error",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product || !Array.isArray(products) || products.length === 0)
    return <p>Product not found</p>;

  const tabData = [
    {
      label: "Description",
      content: <div>{product?.description || "No description available."}</div>,
    },
    {
      label: "Reviews",
      content: (
        <TiffinReviewComponent
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

  // Add Specifications tab if product.specifications exists
  if (product.specifications) {
    tabData.unshift({
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

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <Link to="/">Home</Link> / <Link to="/food">Tiffin</Link> /{" "}
            {product.day}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
              aria-label="Previous product"
            >
              <img
                src="/nextArrow.png"
                alt="Previous"
                className={style.navIconPrev}
              />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products.length - 1}
              className={style.navButton}
              aria-label="Next product"
            >
              <img
                src="/nextArrow.png"
                alt="Next"
                className={style.navIconNext}
              />
            </button>
          </div>
        </div>

        <div className={style.productLayout}>
          <ProductImageGallery
            images={product.image_url || []}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            productName={product.day}
          />

          <div className={style.productDetails}>
            <h1>{product.day.toUpperCase()}</h1>
            <div className={style.priceContainer}>
              <p className="price">${product.subTotal}</p>
            </div>

            {product.category && (
              <p className={style.categoryContaine}>
                Category:{" "}
                <span className={style.category}>{product.category}</span>
              </p>
            )}
            {product.brand && (
              <p className={style.categoryContaine}>
                Brand: <span className={style.category}>{product.brand}</span>
              </p>
            )}

            <div className={style.itemsContainer}>
              {product.items?.map((item, index) => (
                <ItemQuantitySelector
                  key={item._id}
                  item={item}
                  index={index}
                  quantities={quantities}
                  handleItemDecrease={handleItemDecrease}
                  handleItemInputChange={handleItemInputChange}
                  handleItemIncrease={handleItemIncrease}
                />
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
                aria-label="Decrease main quantity"
                disabled={quantities.main <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantities.main}
                onChange={handleMainQuantityChange}
                min="1"
                className={style.quantityInput}
                aria-label="Main quantity"
              />
              <button
                onClick={() =>
                  setQuantities((prev) => ({ ...prev, main: prev.main + 1 }))
                }
                className={style.quantityButton}
                aria-label="Increase main quantity"
              >
                +
              </button>
              <div className={style.addToCartContainer}>
                <Button variant="primary" onClick={handleSubmit} size="sm">
                  ADD TO CART
                </Button>
              </div>
            </div>

            {product.tags && (
              <div className={style.Chip}>
                <h6>Tags:</h6>
                {product.tags.map((tag) => (
                  <Chip key={tag} name={tag} />
                ))}
              </div>
            )}

            {product.shortDescription && (
              <div>
                <h6>Description:</h6>
                <div>
                  <span>{product.shortDescription}</span>
                </div>
              </div>
            )}

            <div className={style.share}>
              Share:
              <div className={style.shareIcons}>
                <FaFacebookF />
                <FaTwitter />
                <BiLogoInstagramAlt />
                <FaPinterest />
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>

        <Tabs tabs={tabData} />
      </div>

      <TiffinRelatedProduct />
      <Footer />
    </div>
  );
};

export default TiffinProductPage;
