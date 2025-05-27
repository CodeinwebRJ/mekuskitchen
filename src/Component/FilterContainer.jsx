import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import { setSearch } from "../../Store/Slice/ProductSlice";
import CheckboxField from "./UI-Components/CheckboxFeild";

const useDebounce = (callback, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => callback(), delay);
    return () => clearTimeout(handler);
  }, [callback, delay]);
};

const FilterSection = ({
  title,
  items,
  searchTerm,
  setSearchTerm,
  selectedItems,
  onChange,
  showAll,
  setShowAll,
  maxItems = 6,
}) => {
  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  return (
    <div className={style.filterGroup}>
      <h6>{title}</h6>
      <input
        type="text"
        placeholder={`Search ${title}`}
        className="form-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label={`Search ${title}`}
      />
      <div className={style.checkboxGroup}>
        {filteredItems.length > 0 ? (
          filteredItems
            .slice(0, showAll ? filteredItems.length : maxItems)
            .map((item) => (
              <div key={item.name} className={style.checkboxItem}>
                <CheckboxField
                  size="small"
                  value={item.name}
                  onChange={() => onChange(item.name)}
                  checked={selectedItems.includes(item.name)}
                  aria-label={item.name}
                />
                <label htmlFor={item.name}>{item.name}</label>
              </div>
            ))
        ) : (
          <p>No {title.toLowerCase()} available</p>
        )}
        {filteredItems.length > maxItems && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={style.linkButton}
            aria-expanded={showAll}
          >
            {showAll ? "Show Less" : `${filteredItems.length - maxItems} MORE`}
          </button>
        )}
      </div>
    </div>
  );
};

// Main FilterContainer component
const FilterContainer = ({
  priceRange,
  handlePriceChange,
  data,
  categoryList = [],
}) => {
  const dispatch = useDispatch();
  const { combinations, products } = useSelector((state) => state.product);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Category-related states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [selectedProductCategories, setSelectedProductCategories] = useState(
    []
  );
  const [showAllProductCategories, setShowAllProductCategories] =
    useState(false);
  const [searchProductCategory, setSearchProductCategory] = useState("");

  // Memoized unique attributes
  const uniqueAttributes = useMemo(() => {
    return combinations.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "Price" && key !== "Stock") {
          if (!acc[key]) acc[key] = new Set();
          if (item[key]) acc[key].add(item[key]);
        }
      });
      return acc;
    }, {});
  }, [combinations]);

  const attributeOptions = useMemo(() => {
    return Object.keys(uniqueAttributes).reduce((acc, key) => {
      acc[key] = [...uniqueAttributes[key]].sort();
      return acc;
    }, {});
  }, [uniqueAttributes]);

  // Memoized derived lists
  const brands = useMemo(
    () => products?.data?.map((product) => product?.brand) || [],
    [products]
  );
  const filteredBrands = useMemo(
    () =>
      brands.filter((brand) =>
        brand?.toLowerCase()?.includes(searchBrand.toLowerCase())
      ),
    [brands, searchBrand]
  );

  const subCategoryList = useMemo(() => {
    return selectedCategories.length
      ? categoryList
          .filter((category) => selectedCategories.includes(category.name))
          .flatMap((category) => category.subCategories || [])
      : categoryList.flatMap((category) => category.subCategories || []);
  }, [categoryList, selectedCategories]);

  const productCategoryList = useMemo(() => {
    return selectedSubCategories.length
      ? subCategoryList
          .filter((sub) => subSubCategories.includes(sub.name))
          .flatMap((sub) => sub.productCategories || [])
      : subCategoryList.length
      ? subCategoryList.flatMap((sub) => sub.subSubCategories || [])
      : categoryList.flatMap((category) =>
          (category.subCategories || []).flatMap(
            (sub) => sub.subSubCategories || []
          )
        );
  }, [categoryList, subCategoryList, selectedSubCategories]);

  useDebounce(() => dispatch(setSearch(searchTerm)), 500);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }, []);

  const handleRatingChange = useCallback((value) => {
    setSelectedRatings((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  }, []);

  const handleFilterChange = useCallback((attribute, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[attribute] || [];
      return {
        ...prev,
        [attribute]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      setSelectedSubCategories([]);
      setSelectedProductCategories([]);
      return newCategories;
    });
  }, []);

  const handleSubCategoryChange = useCallback((subCategory) => {
    setSelectedSubCategories((prev) => {
      const newSubCategories = prev.includes(subCategory)
        ? prev.filter((s) => s !== subCategory)
        : [...prev, subCategory];
      setSelectedProductCategories([]);
      return newSubCategories;
    });
  }, []);

  const handleProductCategoryChange = useCallback((productCategory) => {
    setSelectedProductCategories((prev) => {
      const newProductCategories = prev.includes(productCategory)
        ? prev.filter((p) => p !== productCategory)
        : [...prev, productCategory];
      return newProductCategories;
    });
  }, []);

  return (
    <aside className={style.sidebar} aria-label="Product Filters">
      <div className={style.filterSection}>
        <h3>Filters</h3>

        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search by name"
          aria-label="Search products by name"
        />

        <h6 htmlFor="priceRange">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h6>
        <input
          type="range"
          min="0"
          max="2000"
          value={priceRange[1]}
          onChange={handlePriceChange}
          id="priceRange"
          aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`}
        />

        <FilterSection
          title="Category"
          items={categoryList}
          searchTerm={searchCategory}
          setSearchTerm={setSearchCategory}
          selectedItems={selectedCategories}
          onChange={handleCategoryChange}
          showAll={showAllCategories}
          setShowAll={setShowAllCategories}
        />

        <FilterSection
          title="SubCategory"
          items={subCategoryList}
          searchTerm={searchSubCategory}
          setSearchTerm={setSearchSubCategory}
          selectedItems={selectedSubCategories}
          onChange={handleSubCategoryChange}
          showAll={showAllSubCategories}
          setShowAll={setShowAllSubCategories}
        />

        <FilterSection
          title="Product Category"
          items={productCategoryList}
          searchTerm={searchProductCategory}
          setSearchTerm={setSearchProductCategory}
          selectedItems={selectedProductCategories}
          onChange={handleProductCategoryChange}
          showAll={showAllProductCategories}
          setShowAll={setShowAllProductCategories}
        />

        <FilterSection
          title="Brand"
          items={brands.map((brand) => ({ name: brand }))}
          searchTerm={searchBrand}
          setSearchTerm={setSearchBrand}
          selectedItems={selectedBrands}
          onChange={handleBrandChange}
          showAll={showAllBrands}
          setShowAll={setShowAllBrands}
        />

        <div className={style.filterGroup}>
          <h6>Customer Ratings</h6>
          <div className={style.checkboxGroup}>
            {[5, 4, 3, 2].map((rating) => (
              <div key={rating} className={style.checkboxItem}>
                <CheckboxField
                  size="small"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                  value={rating}
                  aria-label={`${rating} stars and above`}
                />
                <label htmlFor={`rating-${rating}`}>{rating}★ & above</label>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(attributeOptions).map((attribute) => (
          <div key={attribute} className={style.filterGroup}>
            <h6>{attribute}</h6>
            <div className={style.checkboxGroup}>
              {attributeOptions[attribute].map((value) => (
                <div key={value} className={style.checkboxItem}>
                  <CheckboxField
                    size="small"
                    value={value}
                    onChange={() => handleFilterChange(attribute, value)}
                    checked={(selectedFilters[attribute] || []).includes(value)}
                    aria-label={`${attribute}: ${value}`}
                  />
                  <label htmlFor={`${attribute}-${value}`}>
                    {value}
                    {attribute.toLowerCase() === "size" ? "" : " GB"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h5>Top Rated Products</h5>
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((product, index) => (
              <li
                key={product?.productDetails?.id || index}
                className={style.topRatedItem}
              >
                <div className={style.imageContainer}>
                  <img
                    src={
                      product?.productDetails?.image_url || "/defaultImage.png"
                    }
                    alt={product?.productDetails?.product_name || "Product"}
                    className={style.topRatedImg}
                  />
                </div>
                <div className={style.topRatedInfo}>
                  <p>{product?.productDetails?.product_name || "N/A"}</p>
                  <div className={style.rating}>
                    <RatingStar
                      rating={product?.averageRating || 0}
                      start={0}
                      stop={5}
                    />
                  </div>
                  <p className="price">
                    ${product?.productDetails?.price?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p>No top-rated products available.</p>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default FilterContainer;
