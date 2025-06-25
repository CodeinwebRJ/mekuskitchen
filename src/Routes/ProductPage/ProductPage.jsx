import style from "../../styles/ProductPage.module.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../Component/MainComponents/Header";
import ReviewComponent from "./ReviewComponent";
import RelatedProduct from "./RelatedProduct";
import Footer from "../../Component/MainComponents/Footer";
import Tabs from "../../Component/UI-Components/Tabs";
import Loading from "../../Component/UI-Components/Loading";
import ImageGallery from "./ImageGallary";
import useProduct from "../../Hook/useProduct";
import ProductDetails from "./ProductDetails";
import {
  getAllProductReview,
  getProductById,
} from "../../axiosConfig/AxiosConfig";
import { useEffect } from "react";

const getDefaultImage = (productData) => {
  return productData?.images?.[0] || "/default-image.png";
};

const ProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const { products, loading } = useSelector((state) => state.product);

  const {
    product,
    selectedImage,
    selectedSKUs,
    selectedOptions,
    quantity,
    selectedCombination,
    reviews,
    availableOptions,
    rating,
    isAddingToCart,
    review,
    isLiked,
    setSelectedImage,
    setSelectedSKUs,
    setSelectedOptions,
    setReview,
    setQuantity,
    setReviews,
    setRating,
    handleAddToCart,
    setProduct,
    handleWishlistToggle,
  } = useProduct(id);

  const currentIndex = products?.data?.findIndex((p) => p._id === id) ?? -1;

  const handleNext = () => {
    if (currentIndex < (products?.data?.length ?? 0) - 1 && currentIndex >= 0) {
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

  const fetchProduct = async () => {
    if (!id) {
      Toast({ message: "No product selected", type: "error" });
      navigate("/");
      return;
    }

    try {
      const res = await getProductById(id);
      const productData = res.data.data;
      setProduct(productData);
      setSelectedImage(getDefaultImage(productData));
      if (productData?.sku?.length > 0) {
        const firstSKU = productData.sku[0] || {};
        setSelectedSKUs(firstSKU);
        if (firstSKU?.details?.combinations?.length > 0) {
          const firstCombination = firstSKU.details.combinations[0] || {};
          const initialOptions = Object.fromEntries(
            Object.entries(firstCombination).filter(
              ([key]) => key !== "Price" && key !== "Stock"
            )
          );
          setSelectedOptions(initialOptions);
        } else {
          setSelectedOptions({});
        }
      } else {
        setSelectedSKUs({});
        setSelectedOptions({});
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Failed to fetch product:", error);
        Toast({ message: "Failed to load product.", type: "error" });
        setProduct(null);
        setSelectedSKUs({});
        setSelectedOptions({});
      }
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await getAllProductReview(id);
      setReviews(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [id, reviews.length]);

  const tabData = [
    ...(product?.specifications &&
    Object.values(product.specifications).some((val) => !!val)
      ? [
          {
            label: "Specifications",
            content: (
              <div className={style.specification}>
                {Object.entries(product.specifications).map(([key, value]) =>
                  value ? (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ) : null
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      label: "Product Detail",
      content: (
        <div>
          {product?.aboutItem?.length > 0 && (
            <div className={style.aboutItem}>
              <div className={style.aboutItemTitle}>About This Item</div>
              <div>
                {product?.aboutItem?.map((item) => (
                  <ul>
                    <li>{item}</li>
                  </ul>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className={style.aboutItemTitle}>Description</div>
            <div className={style.description}>{product?.description || "No description available"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "Reviews",
      content: (
        <ReviewComponent
          reviews={reviews}
          product={product}
          rating={rating}
          review={review}
          id={id}
          setReview={setReview}
          setRating={setRating}
          fetchReviews={fetchReviews}
        />
      ),
    },
  ];

  return (
    <div>
      <Header />
      {loading || product === null ? (
        <Loading />
      ) : product.length === 0 ? (
        <div>No Data Found</div>
      ) : (
        <div>
          <div className={style.container}>
            <div className={style.header}>
              <div className={style.navigation}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0 || !products?.data}
                  className={style.navButton}
                  aria-label="Previous product"
                >
                  <img
                    src="/nextArrow.png"
                    alt=""
                    className={style.navIconPrev}
                  />
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    currentIndex >= (products?.data?.length ?? 0) - 1 ||
                    !products?.data
                  }
                  className={style.navButton}
                  aria-label="Next product"
                >
                  <img
                    src="/nextArrow.png"
                    alt=""
                    className={style.navIconNext}
                  />
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
                isLiked={isLiked}
                reviews={reviews}
              />
            </div>

            <Tabs tabs={tabData} />
          </div>
          <RelatedProduct />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductPage;
