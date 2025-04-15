import React from "react";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";

const FilterContainer = (props) => {
  const { priceRange, handlePriceChange, topRatedProducts } = props;

  return (
    <aside className={style.sidebar}>
      <div className={style.filterSection}>
        <h3>FILTER BY PRICE</h3>
        <input
          type="range"
          min="0"
          max="20"
          value={priceRange[1]}
          onChange={handlePriceChange}
          className={style.priceSlider}
        />
        <div className={style.range}>
          <p>
            Price: ${priceRange[0]} - ${priceRange[1]}
          </p>
          <button className={style.filterbtn}>FILTER</button>
        </div>
        <hr />
        <h3>TOP RATED PRODUCTS</h3>
        <ul>
          {topRatedProducts?.map((product, index) => (
            <div key={index}>
              <li className={style.topRatedItem}>
                <img
                  src={product.image_url[0]}
                  x
                  alt={product.name}
                  className={style.topRatedImg}
                />
                <div className={style.topRatedInfo}>
                  <p>{product.product_name}</p>
                  <div className={style.rating}>
                    {/* <span>★</span> */}

                    <RatingStar rating={product.avgRating} start={0} stop={5} />
                  </div>
                  <p className={style.topRatedPrice}>${product.price}</p>
                </div>
              </li>
              <hr />
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default FilterContainer;
