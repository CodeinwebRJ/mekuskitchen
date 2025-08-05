import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import style from "../styles/FilterContainer.module.css";
import RatingStar from "./RatingStar";
import SidebarFilter from "./MainComponents/SidebarFilter";
import { useDispatch } from "react-redux";
import { setCategories } from "../../Store/Slice/FilterDataSlice";
import slugify from "../Utils/URLslug";

const FilterContainer = ({ priceRange, data = [], categoryList = [] }) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const mobileSidebarRef = useRef(null);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const categoryArray = categoryParam ? categoryParam.split(",") : [];
    dispatch(setCategories(categoryArray));
  }, [dispatch, searchParams]);

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
            isMobileFilterOpen={isMobileFilterOpen}
          />
        </div>

        <h5>Top Rated Products</h5>
        <ul>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((product, index) => {
              const hasSku =
                Array.isArray(product?.sku) && product.sku.length > 0;
              const skuDetails = hasSku ? product.sku[0]?.details : null;

              const imageUrl =
                skuDetails?.SKUImages?.[0] ||
                product?.images?.[0]?.url ||
                "/defaultImage.png";

              const price =
                skuDetails?.Price ||
                product?.sellingPrice ||
                product?.price ||
                0;

              return (
                <Link
                  key={product?._id || index}
                  to={`/product/${slugify(product?.category)}/${slugify(
                    product?.name
                  )}`}
                  state={{ id: product?._id }}
                >
                  <li className={style.topRatedItem}>
                    <div className={style.imageContainer}>
                      <img
                        src={imageUrl}
                        alt={product?.name || "Product"}
                        className={style.topRatedImg}
                      />
                    </div>
                    <div className={style.topRatedInfo}>
                      <p className={style.top_name}>{product?.name || "N/A"}</p>
                      <div className={style.rating}>
                        <RatingStar
                          rating={product?.averageRating || 0}
                          start={0}
                          stop={5}
                        />
                      </div>
                      <p className="price">${price.toFixed(2)} CAD</p>
                    </div>
                  </li>
                </Link>
              );
            })
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
              isMobileFilterOpen={isMobileFilterOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterContainer;
