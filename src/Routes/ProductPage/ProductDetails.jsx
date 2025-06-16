import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import OptionSelector from "./OptionSelector";
import Chip from "../../Component/Buttons/Chip";
import style from "../../styles/ProductPage.module.css";
import Button from "../../Component/Buttons/Button";
import { Link } from "react-router-dom";

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
  isAddingToCart,
  handleWishlistToggle,
  isLiked,
}) => {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  // const isLikedFromStore = useSelector(
  //   (state) => state.wishlist?.likedMap?.[product?._id] || false
  // );

  // const isLiked = isAuthenticated ? isLikedFromStore : isLikedLocal;

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
      <div className={style.LikeContainer}>
        <h1>{product?.name?.toUpperCase() || "Product Name"}</h1>
        <div className={style.wishlist} onClick={handleWishlistToggle}>
          {isLiked ? (
            <FaHeart color="red" size={20} aria-label="Remove from wishlist" />
          ) : (
            <FaRegHeart size={20} aria-label="Add to wishlist" />
          )}
        </div>
      </div>
      <div className={style.priceContainer}>
        <p className="originalPrice">${product?.price || 0}</p>
        <p className="price">
          $
          {selectedCombination?.Price ??
            product?.sellingPrice ??
            product?.price ??
            0}
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
          Selected Configuration:{" "}
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
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            disabled={product.sku.length > 1 && !selectedCombination}
            aria-label={isAddingToCart ? "Adding to cart" : "Add to cart"}
          >
            ADD TO CART
          </Button>
        </div>
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
          <Link to="#">
            <img src="/facebook.png" alt="FaceBook" />
          </Link>
          <Link to="#">
            <img src="/instagram.png" alt="Twitter" />
          </Link>
          <Link to="#">
            <img src="/Twitter.png" alt="LinkedIn" />
          </Link>
          <Link to="#">
            <img src="/Linkedin.png" alt="Instagram" />
          </Link>
          <Link to="#">
            <img src="/Telegram.png" alt="LinkedIn" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
