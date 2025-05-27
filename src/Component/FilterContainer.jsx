import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import { setSearch } from "../../Store/Slice/ProductSlice";
import {
  resetFilters,
  setCategories,
  setPrices,
  setProductCategories,
  setSubCategories,
  setRatings,
  setBrands,
  setAttributes,
} from "../../Store/Slice/FilterDataSlice";
import CheckboxField from "./UI-Components/CheckboxFeild";

// Custom debounce hook
const useDebounce = (value, delay, callback) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay, callback]);
};

const FilterSection = ({
  title,
  items = [],
  searchTerm,
  setSearchTerm,
  selectedItems = [],
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
        id={`search-${title.toLowerCase()}`}
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
                  aria-label={`${title}: ${item.name}`}
                  id={`checkbox-${title.toLowerCase()}-${item.name}`}
                />
                <label htmlFor={`checkbox-${title.toLowerCase()}-${item.name}`}>
                  {item.name}
                </label>
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

const FilterContainer = ({
  priceRange,
  handlePriceChange,
  data = [],
  categoryList = [],
}) => {
  const dispatch = useDispatch();
  const { combinations, products } = useSelector((state) => state.product);
  const filterData = useSelector((state) => state.filterData);

  console.log(filterData);

  // Initialize states with fallback to empty arrays
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState(
    Array.isArray(filterData.brands) ? filterData.brands : [] // Fallback to empty array
  );
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState(
    Array.isArray(filterData.ratings) ? filterData.ratings : []
  );
  const [selectedFilters, setSelectedFilters] = useState(
    filterData.attributes || {}
  );
  const [selectedCategories, setSelectedCategories] = useState(
    Array.isArray(filterData.categories) ? filterData.categories : []
  );
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    Array.isArray(filterData.subCategories) ? filterData.subCategories : []
  );
  const [showAllSubCategories, setShowAllSubCategories] = useState(false);
  const [searchSubCategory, setSearchSubCategory] = useState("");
  const [selectedProductCategories, setSelectedProductCategories] = useState(
    Array.isArray(filterData.productCategories)
      ? filterData.productCategories
      : []
  );
  const [showAllProductCategories, setShowAllProductCategories] =
    useState(false);
  const [searchProductCategory, setSearchProductCategory] = useState("");

  // Sync priceRange with Redux store
  useEffect(() => {
    dispatch(setPrices(priceRange));
  }, [priceRange, dispatch]);

  // Debug filterData.brands (temporary, remove in production)
  useEffect(() => {
    if (!Array.isArray(filterData.brands)) {
      console.warn(
        "filterData.brands is not an array:",
        filterData.brands,
        "Using fallback empty array"
      );
    }
  }, [filterData.brands]);

  // Memoized unique attributes
  const uniqueAttributes = useMemo(() => {
    if (!combinations?.length) return {};
    return combinations.reduce((acc, item) => {
      if (!item) return acc;
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "Price" && key !== "Stock" && value) {
          if (!acc[key]) acc[key] = new Set();
          acc[key].add(value);
        }
      });
      return acc;
    }, {});
  }, [combinations]);

  const attributeOptions = useMemo(() => {
    return Object.keys(uniqueAttributes).reduce((acc, key) => {
      acc[key] = [...uniqueAttributes[key]].sort((a, b) =>
        typeof a === "string" ? a.localeCompare(b) : a - b
      );
      return acc;
    }, {});
  }, [uniqueAttributes]);

  // Memoized derived lists
  const brands = useMemo(() => {
    const uniqueBrands = new Set(
      products?.data?.map((product) => product?.brand).filter(Boolean)
    );
    return [...uniqueBrands];
  }, [products]);

  const subCategoryList = useMemo(() => {
    if (!categoryList?.length) return [];
    return selectedCategories.length
      ? categoryList
          .filter((category) => selectedCategories.includes(category.name))
          .flatMap((category) => category.subCategories || [])
      : categoryList.flatMap((category) => category.subCategories || []);
  }, [categoryList, selectedCategories]);

  const productCategoryList = useMemo(() => {
    if (!subCategoryList?.length && !categoryList?.length) return [];
    return selectedSubCategories.length
      ? subCategoryList
          .filter((sub) => selectedSubCategories.includes(sub.name))
          .flatMap((sub) => sub.subSubCategories || [])
      : subCategoryList.length
      ? subCategoryList.flatMap((sub) => sub.subSubCategories || [])
      : categoryList.flatMap((category) =>
          (category.subCategories || []).flatMap(
            (sub) => sub.subSubCategories || []
          )
        );
  }, [categoryList, subCategoryList, selectedSubCategories]);

  useDebounce(
    searchTerm,
    500,
    useCallback((value) => dispatch(setSearch(value)), [dispatch])
  );

  const handleBrandChange = useCallback(
    (brand) => {
      if (!Array.isArray(selectedBrands)) {
        console.warn(
          "selectedBrands is not an array:",
          selectedBrands,
          "Resetting to empty array"
        );
        setSelectedBrands([]);
        dispatch(setBrands([]));
        return;
      }
      const newBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand];
      setSelectedBrands(newBrands);
      dispatch(setBrands(newBrands));
    },
    [selectedBrands, dispatch]
  );

  const handleRatingChange = useCallback(
    (value) => {
      const newRatings = selectedRatings.includes(value)
        ? selectedRatings.filter((r) => r !== value)
        : [...selectedRatings, value];
      setSelectedRatings(newRatings);
      dispatch(setRatings(newRatings));
    },
    [selectedRatings, dispatch]
  );

  const handleFilterChange = useCallback((attribute, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[attribute] || [];
      const newAttributes = {
        ...prev,
        [attribute]: currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
      dispatch(setAttributes(newAttributes));
      return newAttributes;
    });
  }, []);

  const handleCategoryChange = useCallback(
    (category) => {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category];
      setSelectedCategories(newCategories);
      dispatch(setCategories(newCategories));

      const validSubCategories = subCategoryList
        .filter(
          (sub) =>
            newCategories.length === 0 ||
            newCategories.some((cat) =>
              categoryList
                .find((c) => c.name === cat)
                ?.subCategories?.some((s) => s.name === sub.name)
            )
        )
        .map((sub) => sub.name);
      const filteredSubCategories = selectedSubCategories.filter((sub) =>
        validSubCategories.includes(sub)
      );
      setSelectedSubCategories(filteredSubCategories);
      dispatch(setSubCategories(filteredSubCategories));

      const validProductCategories = productCategoryList
        .filter(
          (pc) =>
            filteredSubCategories.length === 0 ||
            filteredSubCategories.some((sub) =>
              subCategoryList
                .find((s) => s.name === sub)
                ?.productCategories?.some((p) => p.name === pc.name)
            )
        )
        .map((pc) => pc.name);
      const filteredProductCategories = selectedProductCategories.filter((pc) =>
        validProductCategories.includes(pc)
      );
      setSelectedProductCategories(filteredProductCategories);
      dispatch(setProductCategories(filteredProductCategories));
    },
    [
      selectedCategories,
      categoryList,
      subCategoryList,
      selectedSubCategories,
      productCategoryList,
      selectedProductCategories,
      dispatch,
    ]
  );

  const handleSubCategoryChange = useCallback(
    (subCategory) => {
      const newSubCategories = selectedSubCategories.includes(subCategory)
        ? selectedSubCategories.filter((s) => s !== subCategory)
        : [...selectedSubCategories, subCategory];
      setSelectedSubCategories(newSubCategories);
      dispatch(setSubCategories(newSubCategories));

      const validProductCategories = productCategoryList
        .filter(
          (pc) =>
            newSubCategories.length === 0 ||
            newSubCategories.some((sub) =>
              subCategoryList
                .find((s) => s.name === sub)
                ?.productCategories?.some((p) => p.name === pc.name)
            )
        )
        .map((pc) => pc.name);
      const filteredProductCategories = selectedProductCategories.filter((pc) =>
        validProductCategories.includes(pc)
      );
      setSelectedProductCategories(filteredProductCategories);
      dispatch(setProductCategories(filteredProductCategories));
    },
    [
      selectedSubCategories,
      subCategoryList,
      productCategoryList,
      selectedProductCategories,
      dispatch,
    ]
  );

  const handleProductCategoryChange = useCallback(
    (productCategory) => {
      const newProductCategories = selectedProductCategories.includes(
        productCategory
      )
        ? selectedProductCategories.filter((p) => p !== productCategory)
        : [...selectedProductCategories, productCategory];
      setSelectedProductCategories(newProductCategories);
      dispatch(setProductCategories(newProductCategories));
    },
    [selectedProductCategories, dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedFilters({});
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedProductCategories([]);
    setSearchTerm("");
    setSearchBrand("");
    setSearchCategory("");
    setSearchSubCategory("");
    setSearchProductCategory("");
    handlePriceChange([0, 2000]);
  }, [dispatch, handlePriceChange]);

  return (
    <aside className={style.sidebar}>
      <div className={style.filterSection}>
        <div className={style.filterHeader}>
          <h3>Filters</h3>
          <button onClick={handleClearFilters} className={style.clearButton}>
            Clear All
          </button>
        </div>

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

        <h6>
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h6>
        <div className={style.priceRange}>
          <input
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={handlePriceChange}
            id="priceRange"
            aria-label={`Price range from $${priceRange[0]} to $${priceRange[1]}`}
          />
        </div>

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
                  id={`rating-${rating}`}
                  aria-label={`Rating ${rating} stars and above`}
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
                    id={`filter-${attribute}-${value}`}
                    aria-label={`${attribute}: ${value}`}
                  />
                  <label htmlFor={`filter-${attribute}-${value}`}>
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
