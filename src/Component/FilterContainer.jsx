import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import FilterAndSorting from "../Component/UI-Components/FilterAndShorting";
import {
  setSearch,
  setSortBy,
  setCategory,
  setSubCategory,
  setProductCategory,
} from "../../Store/Slice/ProductSlice";

const FilterContainer = ({
  priceRange,
  handlePriceChange,
  data,
  categoryList = [],
}) => {
  const dispatch = useDispatch();

  const [subCategoryList, setSubCategoryList] = useState([]);
  const [productCategoryList, setProductCategoryList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedProductCategory, setSelectedProductCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setSearch(searchTerm));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const categoryOptions = categoryList.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const subCategoryOptions = subCategoryList.map((sub) => ({
    label: sub?.name,
    value: sub?.name,
  }));

  const productCategoryOptions = productCategoryList.map((item) => ({
    label: item?.name,
    value: item?.name,
  }));

  const handleSelectCategory = (value) => {
    setSelectedCategory(value);
    dispatch(setCategory(value));

    const selected = categoryList.find((cat) => cat.name === value);
    const subCategories = selected?.subCategories || [];

    setSubCategoryList(subCategories);
    setSelectedSubCategory("");
    setProductCategoryList([]);
    setSelectedProductCategory("");
  };

  const handleSelectSubCategory = (value) => {
    setSelectedSubCategory(value);
    dispatch(setSubCategory(value));

    const selectedSub = subCategoryList.find((sub) => sub.name === value);
    const productCats = selectedSub?.subSubCategories || [];

    setProductCategoryList(productCats);
    setSelectedProductCategory("");
  };

  const handleSelectProductCategory = (value) => {
    setSelectedProductCategory(value);
    dispatch(setProductCategory(value));
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.filterSection}>
        <h3>Filters</h3>

        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
          placeholder="Search by name"
        />

        <label htmlFor="priceRange">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={priceRange[1]}
          onChange={handlePriceChange}
          id="priceRange"
        />

        <div>
          <label>Filter by Category</label>
          <FilterAndSorting
            options={categoryOptions}
            placeholder="Category"
            selectedValue={selectedCategory}
            onChange={handleSelectCategory}
          />
        </div>

        <div>
          <label>Filter by SubCategory</label>
          <FilterAndSorting
            options={subCategoryOptions}
            placeholder="SubCategory"
            selectedValue={selectedSubCategory}
            onChange={handleSelectSubCategory}
          />
        </div>

        <div>
          <label>Filter by Product</label>
          <FilterAndSorting
            options={productCategoryOptions}
            placeholder="Product"
            selectedValue={selectedProductCategory}
            onChange={handleSelectProductCategory}
          />
        </div>

        <hr />
        <h3>Top Rated Products</h3>
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((product, index) => (
              <li
                key={product?.productDetails?.id || index}
                className={style.topRatedItem}
              >
                <img
                  src={product?.productDetails?.images?.[0]?.url || ""}
                  alt={product?.productDetails?.name || "Product"}
                  className={style.topRatedImg}
                />
                <div className={style.topRatedInfo}>
                  <p>{product?.productDetails?.name || "N/A"}</p>
                  <div className={style.rating}>
                    <RatingStar
                      rating={product?.averageRating || 0}
                      start={0}
                      stop={5}
                    />
                  </div>
                  <p className="price">
                    ${product?.productDetails?.price || "0.00"}
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
