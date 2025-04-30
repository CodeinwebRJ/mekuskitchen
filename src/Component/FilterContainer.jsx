import React, { useState, useEffect } from "react";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import FilterAndShorting from "./UI-Components/FilterAndShorting";
import { useDispatch } from "react-redux";
import { setSearch } from "../../Store/Slice/ProductSlice";

const FilterContainer = (props) => {
  const { priceRange, handlePriceChange, data } = props;
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setSearch(searchTerm));
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const sortingOptions = [
    { id: 1, label: "Food", value: "food" },
    { id: 2, label: "Grocery", value: "grocery" },
  ];

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
        />
        <div>
          <label>Filter by category</label>
          <FilterAndShorting
            options={sortingOptions}
            placeholder="Category"
            enableNavigation={true}
          />
        </div>
        <hr />
        <h3>TOP RATED PRODUCTS</h3>
        <ul>
          {data?.map((product, index) => (
            <div key={index}>
              <li className={style.topRatedItem}>
                <img
                  src={product?.productDetails?.image_url[0]}
                  alt={product?.productDetails?.product_name}
                  className={style.topRatedImg}
                />
                <div className={style.topRatedInfo}>
                  <p>{product?.productDetails?.product_name}</p>
                  <div className={style.rating}>
                    <RatingStar
                      rating={product?.averageRating}
                      start={0}
                      stop={5}
                    />
                  </div>
                  <p className="price">${product?.productDetails?.price}</p>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterContainer;
