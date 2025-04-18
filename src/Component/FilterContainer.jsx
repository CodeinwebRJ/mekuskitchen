import React from "react";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import Button from "../UI/Button";

const FilterContainer = (props) => {
  const { priceRange, handlePriceChange, data } = props;

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

          <div className={style.filterBtn}>
            <Button variant="success" size="sm" radius="rd-sm">
              FILTER
            </Button>
          </div>
        </div>
        <hr />
        <h3>TOP RATED PRODUCTS</h3>
        <ul>
          {data?.map((product, index) => (
            <div key={index}>
              <li className={style.topRatedItem}>
                <img
                  src={product?.productDetails?.image_url[0]}
                  x
                  alt={product?.productDetails?.product_name}
                  className={style.topRatedImg}
                />
                <div className={style.topRatedInfo}>
                  <p>{product?.productDetails?.product_name}</p>
                  <div className={style.rating}>
                    {/* <span>★</span> */}

                    <RatingStar
                      rating={product?.averageRating}
                      start={0}
                      stop={5}
                    />
                  </div>
                  <p className="price">${product?.productDetails?.price}</p>
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
