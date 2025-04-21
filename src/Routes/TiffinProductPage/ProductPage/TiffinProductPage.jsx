import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLinkedinIn,
} from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import style from "../../../styles/ProductPage.module.css";
import Footer from "../../../Component/MainComponents/Footer";
import TiffinReviewComponent from "./TiffinReviewComponent";
import TiffinRelatedProduct from "./TiffinRelatedProduct";
import Button from "../../../Component/Buttons/Button";
import Header from "../../../Component/MainComponents/Header";
import { AddtoCart } from "../../../axiosConfig/AxiosConfig";

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
  images,
  selectedImage,
  setSelectedImage,
  productName,
}) => (
  <div className={style.imageContainer}>
    <div className={style.productImageContainer}>
      <img
        src={selectedImage || "/placeholder.png"}
        alt={productName}
        className={style.productImage}
      />
    </div>
    <div className={style.thumbnailsContainer}>
      {images?.slice(0, 4).map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`${productName} thumbnail ${index + 1}`}
          className={`${style.thumbnail} ${
            selectedImage === image ? style.selectedThumbnail : ""
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
  <div className={style.items} key={index}>
    <div className={style.itemNo}>{index + 1}.</div>
    <div className={style.itemName}>{item.name}</div>
    <div className={style.itemPrice}>${item.price}</div>
    <div className={style.itemQuantity}>
      <button
        onClick={() => handleItemDecrease(index)}
        className={style.quantityButton}
        aria-label={`Decrease quantity for ${item.name}`}
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
    <div>({item?.weight})</div>
  </div>
);

const TiffinProductPage = () => {
  const location = useLocation();
  const id = location.state?.id;

  const { user } = useSelector((state) => state.auth);
  const tiffin = useSelector((state) => state.tiffin);
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

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url?.[0] || null);
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
      main: isNaN(value) ? 1 : Math.max(1, value),
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

  const productItems = quantities.items.filter((item) => item.quantity !== 0);

  const handleSubmit = async (e) => {
    try {
      const data = {
        user_id: user.userid,
        isTiffinCart: true,
        tiffinMenuId: id,
        customizedItems: productItems,
        specialInstructions: "No onions, please.",
        orderDate: "2025-04-16",
        day: "Tuesday",
        quantity: 1,
        price: "500.00",
      };
      const res = await AddtoCart(data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product || !Array.isArray(products) || products.length === 0)
    return <p>Product not found</p>;

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <a href="/">Home</a> / <a href="/food">Tiffin</a> / {product.day}
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
            images={product.image_url}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            productName={product.day}
          />

          <div className={style.productDetails}>
            <h1>{product.day}</h1>
            <p className={style.price}>${product.subTotal}</p>

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

            <p className={style.categoryContainer}>
              Category:{" "}
              <span className={style.category}>{product.category}</span>
            </p>

            <div className={style.share}>
              Share:
              <div className={style.shareIcons}>
                <FaFacebookF className={style.shareIcon} />
                <FaTwitter className={style.shareIcon} />
                <BiLogoInstagramAlt className={style.shareIcon} />
                <FaPinterest className={style.shareIcon} />
                <FaLinkedinIn className={style.shareIcon} />
              </div>
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
                <Button onClick={handleSubmit} variant="warning" size="sm">
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </div>

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
      </div>

      <TiffinRelatedProduct />
      <Footer />
    </div>
  );
};

export default TiffinProductPage;
