import FilterSection from "../FilterSection";
import InputField from "../UI-Components/InputField";
import style from "../../styles/FilterContainer.module.css";
import CheckboxField from "../UI-Components/CheckboxFeild";
import { IoSearch } from "react-icons/io5";
import { useFilterContainer } from "../../Hook/useFilterContainer";
import { useCallback, useEffect, useRef, useState } from "react";
import { setPrices } from "../../../Store/Slice/FilterDataSlice";
import { useDispatch } from "react-redux";

const SidebarFilter = ({
  categoryList,
  products,
  priceRange,
  isMobileFilterOpen,
}) => {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(priceRange[1]);

  useEffect(() => {
    setSliderValue(priceRange[1]);
  }, [priceRange]);

  const handlePriceChange = useCallback(
    (e) => {
      const newMax = parseInt(e.target.value, 10);
      setSliderValue(newMax);

      if (!isNaN(newMax)) {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
          dispatch(setPrices([0, newMax]));
        }, 500);
      }
    },
    [dispatch]
  );

  const {
    searchTerm,
    setSearchTerm,
    searchBrand,
    setSearchBrand,
    searchCategory,
    setSearchCategory,
    searchSubCategory,
    setSearchSubCategory,
    searchProductCategory,
    setSearchProductCategory,
    showAllBrands,
    setShowAllBrands,
    showAllCategories,
    setShowAllCategories,
    showAllSubCategories,
    setShowAllSubCategories,
    showAllProductCategories,
    setShowAllProductCategories,
    selectedBrands,
    selectedRatings,
    selectedCategories,
    selectedSubCategories,
    selectedProductCategories,
    handleBrandChange,
    handleRatingChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleProductCategoryChange,
    handleClearFilters,
    brands,
    subCategoryList,
    productCategoryList,
  } = useFilterContainer({
    categoryList,
    products,
    priceRange,
    handlePriceChange,
  });

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  return (
    <>
      <div className={style.filterHeader}>
        {!isMobileFilterOpen && <h5>Filters</h5>}
        {isMobileFilterOpen && <div></div>}
        <button onClick={handleClearFilters} className={style.clearButton}>
          Clear All
        </button>
      </div>

      <label htmlFor="search">Search</label>
      <InputField
        id="search"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control"
        placeholder="Search"
        icon={<IoSearch size={20} color="var(--gray-medium)" />}
      />

      <div className={style.priceRangeContainer}>
        <h6 className={style.priceLabel}>
          Price Range: ${priceRange[0]} - ${sliderValue}
        </h6>
        <div className={style.priceRange}>
          <input
            type="range"
            min="0"
            max="2000"
            value={sliderValue}
            onChange={handlePriceChange}
            id="priceRange"
            aria-label={`Price range from $${priceRange[0]} to $${sliderValue}`}
            className={style.rangeInput}
          />
        </div>
      </div>

      <div className={style.filterContainer}>
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
      </div>

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
    </>
  );
};

export default SidebarFilter;
