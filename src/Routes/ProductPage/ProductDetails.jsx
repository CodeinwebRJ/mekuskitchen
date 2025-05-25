import { useSelector } from "react-redux";
import {
  FaFacebookF,
  FaHeart,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import OptionSelector from "./OptionSelector";
import Chip from "../../Component/Buttons/Chip";
import style from "../../styles/ProductPage.module.css";
import Button from "../../Component/Buttons/Button";

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
}) => {
  const { user } = useSelector((state) => state.auth);
  const isLiked = useSelector((state) => state.wishlist?.likedMap?.[product._id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(isNaN(value) ? 1 : Math.max(1, value));
  };

  const handleOptionSelect = (attribute, value) => {
    setSelectedOptions((prev) => {
      const newOptions = { ...prev, [attribute]: value };
      Object.keys(newOptions).forEach((key) => {
        if (key !== attribute && !isOptionCompatible(key, newOptions[key])) {
          const validCombo = selectedSKUs.combinations.find(
            (c) => c[attribute] === value
          );
          if (validCombo) newOptions[key] = validCombo[key];
        }
      });
      return newOptions;
    });
  };

  const isOptionCompatible = (attribute, value) => {
    if (!selectedSKUs?.combinations) return true;
    return selectedSKUs.combinations.some((combo) =>
      Object.entries(selectedOptions).every(
        ([key, val]) =>
          key === attribute || combo[key] === val || combo[attribute] === value
      )
    );
  };

  return (
    <div className={style.productDetails}>
      <div>
        <h1>{product.name.toUpperCase()}</h1>
        <div className={style.wishlist}>
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
        </div>
      </div>
      <div className={style.priceContainer}>
        <p className="originalPrice">${product?.price}</p>
        <p className="price">
          $
          {selectedCombination?.Price ??
            product?.sellingPrice ??
            product?.price}
        </p>
      </div>

      {!selectedCombination && Object.keys(selectedOptions).length > 0 && (
        <p className={style.unavailableMessage}>Unavailable</p>
      )}

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

      {selectedCombination && (
        <p className={style.selectedCombination}>
          Selected Configuration:{" "}
          {Object.entries(selectedOptions)
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
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
            disabled={isAddingToCart || !selectedCombination}
          >
            {isAddingToCart ? "Adding..." : "ADD TO CART"}
          </Button>
        </div>
      </div>

      {product.sku?.length > 1 && (
        <>
          <div className={style.colorContainer}>
            <h6>Color:</h6>
            {product.sku.map((item, i) => {
              const firstImg = item.details?.SKUImages?.[0] || "/defaultImage.png";
              return (
                <img
                  key={i}
                  src={firstImg}
                  className={style.thumbnail}
                  onClick={() => {
                    setSelectedSKUs(item.details || []);
                    if (item.details?.combinations?.length > 0) {
                      const firstCombination = item.details.combinations[0];
                      const initialOptions = {};
                      Object.keys(firstCombination).forEach((key) => {
                        if (key !== "Price" && key !== "Stock") {
                          initialOptions[key] = firstCombination[key];
                        }
                      });
                      setSelectedOptions(initialOptions);
                    } else {
                      setSelectedOptions({});
                    }
                  }}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelectedSKUs(item.details || []);
                      if (item.details?.combinations?.length > 0) {
                        const firstCombination = item.details.combinations[0];
                        const initialOptions = {};
                        Object.keys(firstCombination).forEach((key) => {
                          if (key !== "Price" && key !== "Stock") {
                            initialOptions[key] = firstCombination[key];
                          }
                        });
                        setSelectedOptions(initialOptions);
                      } else {
                        setSelectedOptions({});
                      }
                    }
                  }}
                  alt={`Color option ${i + 1}`}
                />
              );
            })}
          </div>
          {selectedSKUs?.combinations?.length > 0 &&
            Object.entries(availableOptions).map(([attribute, options]) => (
              <OptionSelector
                key={attribute}
                options={options}
                selected={selectedOptions[attribute]}
                onSelect={(value) => handleOptionSelect(attribute, value)}
                label={attribute}
                isCompatible={(value) => isOptionCompatible(attribute, value)}
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
            ))}
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

      <div className={style.share}>
        Share:
        <div className={style.shareIcons}>
          <FaFacebookF size={16} aria-label="Share on Facebook" />
          <FaTwitter size={16} aria-label="Share on Twitter" />
          <BiLogoInstagramAlt size={16} aria-label="Share on Instagram" />
          <FaLinkedinIn size={16} aria-label="Share on LinkedIn" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;