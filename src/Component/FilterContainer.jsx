import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import FilterAndSorting from "../Component/UI-Components/FilterAndShorting";
import {
  setSearch,
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
    dispatch(setSubCategory(""));
    dispatch(setProductCategory(""));
  };

  const handleSelectSubCategory = (value) => {
    setSelectedSubCategory(value);
    dispatch(setSubCategory(value));

    const selectedSub = subCategoryList.find((sub) => sub.name === value);
    const productCats = selectedSub?.subSubCategories || [];

    setProductCategoryList(productCats);
    setSelectedProductCategory("");
    dispatch(setProductCategory(""));
  };

  const handleSelectProductCategory = (value) => {
    setSelectedProductCategory(value);
    dispatch(setProductCategory(value));
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.filterSection}>
        <h3>Filters</h3>

        <h6 htmlFor="search">Search</h6>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search by name"
        />

        <h6 htmlFor="priceRange">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </h6>
        <input
          type="range"
          min="0"
          max="20"
          value={priceRange[1]}
          onChange={handlePriceChange}
          id="priceRange"
        />

        <div>
          <h6>Filter by Category</h6>
          <FilterAndSorting
            options={categoryOptions}
            placeholder="Category"
            selectedValue={selectedCategory}
            onChange={handleSelectCategory}
          />
        </div>

        <div>
          <h6>Filter by SubCategory</h6>
          <FilterAndSorting
            options={subCategoryOptions}
            placeholder="SubCategory"
            selectedValue={selectedSubCategory}
            onChange={handleSelectSubCategory}
          />
        </div>

        <div>
          <h6>Filter by Product</h6>
          <FilterAndSorting
            options={productCategoryOptions}
            placeholder="Product"
            selectedValue={selectedProductCategory}
            onChange={handleSelectProductCategory}
          />
        </div>
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
                      product?.productDetails?.image_url || "/defultImage.png"
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
