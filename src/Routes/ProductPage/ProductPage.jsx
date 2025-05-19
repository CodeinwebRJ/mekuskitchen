import { useEffect, useState } from "react";
import style from "../../styles/ProductPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Component/MainComponents/Header";
import ReviewComponent from "./ReviewComponent";
import RelatedProduct from "./RelatedProduct";
import Footer from "../../Component/MainComponents/Footer";
import Button from "../../Component/Buttons/Button";
import { Toast } from "../../Utils/Toast";
import { AddtoCart } from "../../axiosConfig/AxiosConfig";
import { setCart } from "../../../Store/Slice/UserCartSlice";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import Tabs from "../../Component/UI-Components/Tabs";
import Chip from "../../Component/Buttons/Chip";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const Cart = useSelector((state) => state.cart);
  const productState = useSelector((state) => state.product);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const products = productState.products?.data || [];
  const loading = productState.loading;

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(
          foundProduct.images
            ? foundProduct.images?.[0]?.url || "/defultImage.png"
            : foundProduct?.sku[0]?.details?.SKUImages[0]?.url ||
                "/defultImage.png"
        );
      } else {
        setProduct(null);
      }
    }
  }, [id, products]);

  const currentIndex = products.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex !== -1 && currentIndex < products.length - 1) {
      const nextProduct = products[currentIndex + 1];
      setProduct(nextProduct);
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products[currentIndex - 1];
      setProduct(prevProduct);
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product || !Array.isArray(products) || products.length === 0) {
    return <p>Product not found</p>;
  }

  const handleAddToCart = async () => {
    if (!user) return;
    if (Cart?.items?.tiffins.length > 0) {
      Toast({
        message: "Tiffin is already added to cart!",
        type: "error",
      });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity: quantity,
        price: product.price,
      });
      dispatch(setCart(res.data.data));
      Toast({
        message: "Product added to cart suceessfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({
        message: "Failed to add product in cart.",
        type: "error",
      });
    }
  };

  const tabData = [];

  if (product.sku && product.sku.length > 1) {
    tabData.push({
      label: "Specifications",
      content: (
        <div>
          {product?.specifications &&
            Object.entries(product.specifications).map(([key, value]) => (
              <div key={key}>
                <strong>{key} : </strong>
                {value}
              </div>
            ))}
        </div>
      ),
    });
  }

  tabData.push(
    {
      label: "Product Detail",
      content: <div>{product?.description}</div>,
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
    }
  );

  console.log(product);

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <Link to="/home">Home</Link> / <Link to="">Food</Link> /{" "}
            {product.name}
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
          <div className={style.imageContainer}>
            <div className={style.productImageContainer}>
              <img
                src={
                  selectedImage || product.images?.[0].url || "/defultImage.png"
                }
                alt={product.name}
                className={style.productImage}
              />
              <div></div>
            </div>
            <div className={style.thumbnailsContainer}>
              {product.images?.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image.url || "/defaultImage.png"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={style.thumbnail}
                  onClick={() => {
                    setSelectedImage(image.url || "/defaultImage.png");
                  }}
                />
              ))}
            </div>
          </div>
          <div className={style.productDetails}>
            <h1>{product.name.toUpperCase()}</h1>
            <div className={style.priceContainer}>
              <p className="originalPrice">${product?.price}</p>
              <p className="price">${product?.sellingPrice}</p>
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
            <div className={style.quantity}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={style.quantityButton}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className={style.quantityInput}
                aria-label="Quantity"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={style.quantityButton}
                aria-label="Increase quantity"
              >
                +
              </button>

              <div className={style.addToCartContainer}>
                <Button onClick={handleAddToCart} variant="primary" size="sm">
                  ADD TO CART
                </Button>
              </div>
            </div>
            {product.sku && product.sku.length > 1 && (
              <div className={style.colorContainer}>
                <h6>Color : </h6>
                <div className={style.thumbnailsContainer}>
                  {product.sku.map((item, i) => {
                    const firstImage = item.details.SKUImages[0];
                    return (
                      <img
                        key={i}
                        src={firstImage?.url || "/defaultImage.png"}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        className={style.thumbnail}
                        onClick={() => {
                          setSelectedImage(
                            firstImage?.url || "/defaultImage.png"
                          );
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {product.sku && product.sku.length > 1 && (
              <div className={style.colorContainer}>
                <h6>Storage : </h6>
                <div className={style.thumbnailsContainer}>
                  <div>
                    {product?.sku?.map((item, i) => item?.details?.Storge)}
                  </div>
                </div>
              </div>
            )}

            {product.tags && (
              <>
                <div className={style.Chip}>
                  <h6>Tags:</h6>
                  {product.tags?.map((tag) => (
                    <Chip name={tag} />
                  ))}
                </div>
              </>
            )}
            <div>
              <h6>Description : </h6>
              <div>
                {product.description && <span>{product.shortDescription}</span>}
              </div>
            </div>
            <div className={style.share}>
              Share:
              <div className={style.shareIcons}>
                <FaFacebookF size={16} />
                <FaTwitter size={16} />
                <BiLogoInstagramAlt size={16} />
                <FaLinkedinIn size={16} />
              </div>
            </div>
          </div>
        </div>

        <Tabs tabs={tabData} />
      </div>
      <RelatedProduct />
      <Footer />
    </div>
  );
};

export default ProductPage;
