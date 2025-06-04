import style from "../../styles/ProductPage.module.css";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../Component/MainComponents/Header";
import ReviewComponent from "./ReviewComponent";
import RelatedProduct from "./RelatedProduct";
import Footer from "../../Component/MainComponents/Footer";
import Tabs from "../../Component/UI-Components/Tabs";
import Loading from "../../Component/UI-Components/Loading";
import ImageGallery from "./ImageGallary";
import useProduct from "../../Hook/useProduct";
import ProductDetails from "./ProductDetails";

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const { products, loading } = useSelector((state) => state.product);

  const {
    product,
    selectedImage,
    setSelectedImage,
    selectedSKUs,
    setSelectedSKUs,
    selectedOptions,
    setSelectedOptions,
    quantity,
    setQuantity,
    reviews,
    setReviews,
    rating,
    setRating,
    review,
    setReview,
    selectedCombination,
    availableOptions,
    handleAddToCart,
    isAddingToCart,
    handleWishlistToggle,
    isLikedLocal,
  } = useProduct(id);

  const currentIndex = products?.data?.findIndex((p) => p._id === id);

  const handleNext = () => {
    if (currentIndex < products?.data?.length - 1) {
      const nextProduct = products.data[currentIndex + 1];
      navigate(location.pathname, { state: { id: nextProduct._id } });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevProduct = products.data[currentIndex - 1];
      navigate(location.pathname, { state: { id: prevProduct._id } });
    }
  };

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
    ...(product?.sku?.length > 1 && product.specifications
      ? [
          {
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
          },
        ]
      : []),
  ];

  if (loading) return <Loading />;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <Header />
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.breadcrumb}>
            <Link to="/">Home</Link> /{" "}
            <Link to="/product-category">{product.category}</Link> /{" "}
            {product.name}
          </div>
          <div className={style.navigation}>
            <button
              onClick={handlePrev}
              disabled={currentIndex <= 0}
              className={style.navButton}
              aria-label="Previous product"
            >
              <img src="/nextArrow.png" alt="" className={style.navIconPrev} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= products?.data?.length - 1}
              className={style.navButton}
              aria-label="Next product"
            >
              <img src="/nextArrow.png" alt="" className={style.navIconNext} />
            </button>
          </div>
        </div>

        <div className={style.productLayout}>
          <ImageGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            selectedSKUs={selectedSKUs}
          />
          <ProductDetails
            product={product}
            selectedSKUs={selectedSKUs}
            setSelectedSKUs={setSelectedSKUs}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedCombination={selectedCombination}
            availableOptions={availableOptions}
            handleAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart}
            handleWishlistToggle={handleWishlistToggle}
            isLikedLocal={isLikedLocal}
          />
        </div>

        <Tabs tabs={tabData} />
      </div>
      <RelatedProduct />
      <Footer />
    </div>
  );
};

export default ProductPage;
