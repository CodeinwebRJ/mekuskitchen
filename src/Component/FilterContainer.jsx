import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import FilterAndSorting from "../Component/UI-Components/FilterAndShorting";
import { setSearch, setSortBy } from "../../Store/Slice/ProductSlice";

const FilterContainer = ({ priceRange, handlePriceChange, data }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setSearch(searchTerm));
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const categoryOptions = [
    { id: 1, label: "Food", value: "food" },
    { id: 2, label: "Grocery", value: "grocery" },
    { id: 2, label: "Clothing", value: "Clothing" },
    { id: 2, label: "Grocery", value: "grocery" },
  ];

  const sortOptions = [
    { id: 1, label: "Default", value: "" },
    { id: 1, label: "High to Low", value: "high-to-low" },
    { id: 2, label: "Low to High", value: "low-to-high" },
    { id: 2, label: "Sort by latest", value: "sortbylatest" },
    { id: 2, label: "Sort by average rating", value: "sortbyaverageratings" },
  ];

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.filterSection}>
        <h3>Filters</h3>
        <label htmlFor="search" className="form-label">
          Search
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
          placeholder="Search by name"
        />
        <label htmlFor="priceRange" className="form-label">
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
          <label>Filter by category</label>
          <FilterAndSorting
            options={categoryOptions}
            placeholder="Category"
            enableNavigation={true}
          />
        </div>
        <div>
          <label>Sort by</label>
          <FilterAndSorting options={sortOptions} onChange={handleSortChange} />
        </div>
        <hr />
        <h3>Top Rated Products</h3>
        <ul>
          {data?.map((product, index) => (
            <li
              key={product?.productDetails?.id || index}
              className={style.topRatedItem}
            >
              <img
                src={product?.productDetails?.images?.[0].url || ""}
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
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterContainer;
