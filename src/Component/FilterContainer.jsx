import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import SidebarFilter from "./MainComponents/SidebarFilter";

const FilterContainer = ({
  priceRange,
  handlePriceChange,
  data = [],
  categoryList = [],
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileSidebarRef = useRef(null);

  const toggleMobileFilter = () => setIsMobileFilterOpen((prev) => !prev);
  const closeMobileFilter = () => setIsMobileFilterOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target)
      ) {
        closeMobileFilter();
      }
    };

    if (isMobileFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileFilterOpen]);

  return (
    <>
      <aside className={style.sidebar}>
        <div>
          <SidebarFilter
            categoryList={categoryList}
            data={data}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            isMobileFilterOpen={isMobileFilterOpen}
          />
        </div>

        <h5>Top Rated Products</h5>
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((product, index) => (
              <Link
                key={product?._id || index}
                to={`/product/${String(
                  product?.category
                ).toLowerCase()}/${String(
                  product?.product_name
                ).toLowerCase()}`}
                state={{ id: product?._id }}
              >
                <li className={style.topRatedItem}>
                  <div className={style.imageContainer}>
                    <img
                      src={product?.images[0]?.url || "/defaultImage.png"}
                      alt={product?.product_name || "Product"}
                      className={style.topRatedImg}
                    />
                  </div>
                  <div className={style.topRatedInfo}>
                    <p>{product?.name || "N/A"}</p>
                    <div className={style.rating}>
                      <RatingStar
                        rating={product?.averageRating || 0}
                        start={0}
                        stop={5}
                      />
                    </div>
                    <p className="price">
                      ${product?.price?.toFixed(2) || "0.00"} CAD
                    </p>
                  </div>
                </li>
              </Link>
            ))
          ) : (
            <p>No top-rated products available.</p>
          )}
        </ul>
      </aside>

      <div className={style.mobileFilter}>
        <button
          className={style.mobileFilterButton}
          onClick={toggleMobileFilter}
        >
          Filters
        </button>
      </div>

      {isMobileFilterOpen && (
        <div className={style.mobileSidebarOverlay}>
          <div className={style.mobileSidebar} ref={mobileSidebarRef}>
            <div className={style.mobileSidebarHeader}>
              <h3>Filters</h3>
              <button onClick={closeMobileFilter} className={style.closeButton}>
                ✕
              </button>
            </div>
            <SidebarFilter
              categoryList={categoryList}
              data={data}
              priceRange={priceRange}
              handlePriceChange={handlePriceChange}
              isMobileFilterOpen={isMobileFilterOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterContainer;
