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
  const dispatch = useDispatch();

  const id = location.state?.id;
  const { user } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.product);
  const Cart = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [reviews, setReviews] = useState([]);

  const defaultImage = "/defaultImage.png";

  useEffect(() => {
    const foundProduct = products?.data?.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      const firstImage =
        foundProduct.images?.[0]?.url ||
        foundProduct?.sku?.[0]?.details?.SKUImages?.[0] ||
        defaultImage;
      setSelectedImage(firstImage);
      setSelectedSKUs(foundProduct?.sku?.[0]?.details?.SKUImages || []);
    } else {
      setProduct(null);
      setSelectedSKUs([]);
    }
  }, [id, products]);

  const currentIndex = products?.data?.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      const nextProduct = products[currentIndex + 1];
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products[currentIndex - 1];
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const handleAddToCart = async () => {
    if (!user) return;
    if (Cart?.items?.tiffins?.length > 0) {
      Toast({ message: "Tiffin is already added to cart!", type: "error" });
      return;
    }

    try {
      const res = await AddtoCart({
        user_id: user.userid,
        isTiffinCart: false,
        product_id: product._id,
        quantity,
        price: product.price,
      });
      dispatch(setCart(res.data.data));
      Toast({ message: "Product added to cart successfully", type: "success" });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toast({ message: "Failed to add product to cart.", type: "error" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const tabData = [
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
    },
  ];

  if (product.sku?.length > 1 && product.specifications) {
    tabData.unshift({
      label: "Specifications",
      content: (
        <div>
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
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
            <Link to="/">Home</Link> / <Link to="">Food</Link> /{" "}
            {product.name}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
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
                src={selectedImage || defaultImage}
                alt={product.name}
                className={style.productImage}
              />
            </div>
            <div className={style.thumbnailsContainer}>
              {(product.sku?.length > 1
                ? selectedSKUs.SKUImages[0]
                : product.images
              )
                ?.slice(0, 4)
                .map((img, idx) => {
                  const url =
                    typeof img === "string" ? img : img?.url || defaultImage;
                  return (
                    <img
                      key={idx}
                      src={url}
                      alt={`Thumbnail ${idx}`}
                      className={style.thumbnail}
                      onClick={() => setSelectedImage(url)}
                    />
                  );
                })}
            </div>
          </div>

          <div className={style.productDetails}>
            <h1>{product.name.toUpperCase()}</h1>
            <div className={style.priceContainer}>
              <p className="originalPrice">${product?.price}</p>
              <p className="price">${product?.sellingPrice}</p>
            </div>

            {product.category && (
              <p>
                Category: <span>{product.category}</span>
              </p>
            )}
            {product.brand && (
              <p>
                Brand: <span>{product.brand}</span>
              </p>
            )}

            <div className={style.quantity}>
              <button
                className={style.quantityButton}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className={style.quantityInput}
                min="1"
              />
              <button
                className={style.quantityButton}
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              <div className={style.addToCartContainer}>
                <Button onClick={handleAddToCart} variant="primary" size="sm">
                  ADD TO CART
                </Button>
              </div>
            </div>
            {product.sku?.length > 1 && (
              <>
                <div className={style.colorContainer}>
                  <h6>Color:</h6>
                  {product.sku.map((item, i) => {
                    const firstImg =
                      item.details?.SKUImages?.[0] || defaultImage;
                    return (
                      <img
                        key={i}
                        src={firstImg}
                        className={style.thumbnail}
                        onClick={() => {
                          setSelectedImage(firstImg);
                          setSelectedSKUs(item.details || []);
                        }}
                      />
                    );
                  })}
                </div>
                <div>
                  <h6 className="">
                    Storage:
                    {[
                      ...new Set(
                        product.sku.flatMap((s) =>
                          s.details?.combinations.map((c) => c.Storage)
                        )
                      ),
                    ].map((storage, idx) => (
                      <span key={idx}>{storage}</span>
                    ))}
                  </h6>
                </div>
                <div>
                  <h6>
                    RAM:
                    {[
                      ...new Set(
                        product.sku.flatMap((s) =>
                          s.details?.combinations.map((c) => c.RAM)
                        )
                      ),
                    ].map((ram, idx) => (
                      <span key={idx}>{ram}</span>
                    ))}
                  </h6>
                </div>
              </>
            )}
            {product.tags?.length > 0 && (
              <div className={style.Chip}>
                <h6>Tags:</h6>
                {product.tags.map((tag) => (
                  <Chip key={tag} name={tag} />
                ))}
              </div>
            )}
            <div>
              <h6>Description:</h6>
              <span>{product.shortDescription}</span>
            </div>

            {/* Social Icons */}
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
