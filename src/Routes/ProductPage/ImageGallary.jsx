import { Link } from "react-router-dom";
import style from "../../styles/ImageGallary.module.css";

const ImageGallery = ({
  product,
  selectedImage,
  setSelectedImage,
  selectedSKUs,
}) => {
  const defaultImage = "/defaultImage.png";
  const thumbnailImages =
    selectedSKUs?.details?.SKUImages?.length > 1
      ? selectedSKUs.details?.SKUImages.slice(0, 4) || "defaultImage.png"
      : product?.images?.slice(0, 4) || "defaultImage.png";

  return (
    <div className={style.imageContainer}>
      <div className={style.breadcrumb}>
        <Link to="/">Home</Link> /{" "}
        <Link to="/product-category">{product.category || "Category"}</Link> /{" "}
        {product.name || "Product"}
      </div>
      <div className={style.productImageContainer}>
        <img
          src={selectedImage || defaultImage}
          alt={product.name}
          className={style.productImage}
        />
      </div>
      <div className={style.thumbnailsContainer}>
        {thumbnailImages?.map((img, idx) => {
          const url =
            typeof img === "string" ? img : img?.url || "/defaultImage.png";
          return (
            <img
              key={idx}
              src={url}
              alt={`Thumbnail ${idx + 1}`}
              className={style.thumbnail}
              onClick={() => setSelectedImage(url)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectedImage(url)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;
