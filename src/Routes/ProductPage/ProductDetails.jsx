import { FaHeart, FaRegHeart } from "react-icons/fa";
import OptionSelector from "./OptionSelector";
import Chip from "../../Component/Buttons/Chip";
import style from "../../styles/ProductPage.module.css";
import RatingStar from "../../Component/RatingStar";
import Features from "../../Component/UI-Components/Features";

const ProductDetails = ({
  product,
  selectedSKUs,
  setSelectedSKUs,
  selectedOptions,
  setSelectedOptions,
  quantity,
  setQuantity,
  selectedCombination,
  availableOptions,
  handleAddToCart,
  handleWishlistToggle,
  isLiked,
  reviews,
}) => {
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  const handleOptionSelect = (attribute, value) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev, [attribute]: value };
      if (!selectedSKUs?.details?.combinations) return newOptions;
      Object.keys(newOptions).forEach((key) => {
        if (key !== attribute && !isOptionCompatible(key, newOptions[key])) {
          const validCombo = selectedSKUs.details.combinations.find(
            (c) => c[attribute] === value
          );
          if (validCombo) {
            newOptions[key] = validCombo[key];
          } else {
            delete newOptions[key];
          }
        }
      });
      return newOptions;
    });
  };

  const isOptionCompatible = (attribute, value) => {
    if (!selectedSKUs?.details?.combinations) return true;
    return selectedSKUs.details.combinations.some((combo) =>
      Object.entries(selectedOptions).every(
        ([key, val]) =>
          key === attribute || combo[key] === val || combo[attribute] === value
      )
    );
  };

  const handleSKUSelect = (item) => {
    if (!item?.details) return;
    setSelectedSKUs(item);
    if (item?.details?.combinations?.length > 0) {
      const firstCombination = item.details.combinations[0];
      const initialOptions = {};
      Object.keys(firstCombination).forEach((key) => {
        if (key !== "price" && key !== "Stock") {
          initialOptions[key] = firstCombination[key];
        }
      });
      setSelectedOptions(initialOptions);
    } else {
      setSelectedOptions({});
    }
  };

  return (
    <div className={style.productDetails}>
      <div>
        <div className={style.LikeContainer}>
          <h5>{product?.name?.toUpperCase() || "Product Name"}</h5>
          <div className={style.wishlist} onClick={handleWishlistToggle}>
            {isLiked ? (
              <FaHeart
                color="red"
                size={20}
                aria-label="Remove from wishlist"
              />
            ) : (
              <FaRegHeart size={20} aria-label="Add to wishlist" />
            )}
          </div>
        </div>
        <div className={style.ratingContainer}>
          <RatingStar rating={product?.averageRating || 0} disabled />
          <span>({reviews?.length || 0})</span>
        </div>
        <div>
          <span>500+ bought in past month</span>
        </div>
      </div>
      <div className={style.priceContainer}>
        <p className="originalPrice">${product?.price || 0}</p>
        <p className="price">
          $
          {selectedCombination?.Price ??
            product?.sellingPrice ??
            product?.price ??
            0}{" "}
          CAD
        </p>
      </div>
      {!selectedCombination && Object.keys(selectedOptions).length > 0 && (
        <p className={style.unavailableMessage}>Unavailable</p>
      )}
      {product?.category && (
        <p>
          Category: <span>{product.category}</span>
        </p>
      )}
      {product?.brand && (
        <p>
          Brand: <span>{product.brand}</span>
        </p>
      )}
      {selectedCombination && (
        <p className={style.selectedCombination}>
          Selected :{" "}
          {Object.entries(selectedOptions)
            .map(([key, value]) => `${value} ${key}`)
            .join(", ") || "None"}
        </p>
      )}
      <div className={style.quantity}>
        <button
          className={style.quantityButton}
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className={style.quantityInput}
          min="1"
          aria-label="Quantity"
        />
        <button
          className={style.quantityButton}
          onClick={() => setQuantity(quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
        <div className={style.addToCartContainer}>
          <button
            onClick={handleAddToCart}
            className="Button sm"
            disabled={product.sku.length > 1 && !selectedCombination}
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <div>
        <Features />
      </div>

      {product?.sku?.length > 0 &&
        product?.sku[0]?.details?.combinations?.length > 0 && (
          <>
            <div className={style.colorContainer}>
              <h6>Color:</h6>
              {product.sku.map((item, i) => {
                const firstImg =
                  item?.details?.SKUImages?.[0] || "/defaultImage.png";
                return (
                  <img
                    key={item._id || i}
                    src={firstImg}
                    className={`${style.thumbnail} ${
                      selectedSKUs?._id === item._id ? style.selected : ""
                    }`}
                    onClick={() => handleSKUSelect(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSKUSelect(item);
                    }}
                    tabIndex={0}
                    alt={`Color option for ${item?.details?.SKUname || "SKU"}`}
                    role="button"
                  />
                );
              })}
            </div>
            {selectedSKUs?.details?.combinations?.length > 0 &&
              Object.entries(availableOptions || {}).map(
                ([attribute, options]) => (
                  <OptionSelector
                    key={attribute}
                    options={options}
                    selected={selectedOptions[attribute]}
                    onSelect={(value) => handleOptionSelect(attribute, value)}
                    label={attribute}
                    isCompatible={(value) =>
                      isOptionCompatible(attribute, value)
                    }
                    suffix={
                      attribute.toLowerCase().includes("size") ||
                      attribute.toLowerCase().includes("weight")
                        ? attribute.toLowerCase().includes("weight")
                          ? options[0]?.toLowerCase().includes("kg")
                            ? ""
                            : "g"
                          : ""
                        : ""
                    }
                  />
                )
              )}
          </>
        )}

      {product?.tags?.length > 0 && (
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
          <img src="/facebook.png" alt="FaceBook" />
          <img src="/instagram.png" alt="Twitter" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
