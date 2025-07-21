import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import style from "../../styles/ImageGallary.module.css";

const ImageGallery = ({
  product,
  selectedImage,
  setSelectedImage,
  selectedSKUs,
  selectedCombination,
}) => {
  const defaultImage = "/defaultImage.png";
  const thumbnailImages =
    selectedSKUs?.details?.SKUImages?.length > 1
      ? selectedSKUs.details?.SKUImages.slice(0, 4)
      : product?.images?.slice(0, 4) || [defaultImage];

  const imageList = thumbnailImages.map((img) =>
    typeof img === "string" ? img : img?.url || defaultImage
  );

  const currentIndex = imageList.findIndex((img) => img === selectedImage);
  const imageRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    setFadeKey((prev) => prev + 1);
  }, [selectedImage]);

  const handleSwipe = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const threshold = 50;

    if (distance > threshold && currentIndex < imageList.length - 1) {
      setSelectedImage(imageList[currentIndex + 1]);
    } else if (distance < -threshold && currentIndex > 0) {
      setSelectedImage(imageList[currentIndex - 1]);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    if (touchStartX !== null && touchEndX !== null) {
      handleSwipe();
    }
  }, [touchEndX]);

  console.log(selectedCombination);

  return (
    <div className={style.imageContainer}>
      <div className={style.breadcrumb}>
        <Link to="/">Home</Link> /{" "}
        <Link to="/product-category">{product.category || "Category"}</Link> /{" "}
        {product.name || "Product"}
      </div>

      <div
        className={style.productImageContainer}
        ref={imageRef}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => setTouchEndX(e.changedTouches[0].clientX)}
      >
        <img
          key={fadeKey}
          src={selectedImage || defaultImage}
          alt={product.name}
          className={`${style.productImage} ${style.fadeIn}`}
        />
        {selectedCombination?.Stock === 0 && (
          <span className={style.outOfStockBadge}>Out of Stock</span>
        )}
      </div>

      <div className={style.thumbnailsContainer}>
        {imageList.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Thumbnail ${idx + 1}`}
            className={`${style.thumbnail} ${
              url === selectedImage ? style.activeThumbnail : ""
            }`}
            onClick={() => setSelectedImage(url)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedImage(url)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
