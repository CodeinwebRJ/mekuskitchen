import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setPriceRange,
  setGrid,
  setPage,
} from "../../../Store/Slice/ProductSlice.jsx";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice.jsx";
import {
  getCategory,
  getTopRatedProduct,
  getUserWishlist,
} from "../../axiosConfig/AxiosConfig.js";
import Header from "../../Component/MainComponents/Header";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import ProductCard from "../../Component/Cards/ProductCard.jsx";
import FilterContainer from "../../Component/FilterContainer.jsx";
import ShowProducts from "../../Component/ShowProducts";
import Pagination from "../../Component/Pagination.jsx";
import Loading from "../../Component/UI-Components/Loading.jsx";
import { IoGrid } from "react-icons/io5";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import styles from "../../styles/Food.module.css";

const FoodPage = () => {
  const [topRated, setTopRated] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { priceRange, grid, loading, error, products } = useSelector(
    (state) => state.product
  );

  const handlePriceChange = useCallback(
    (e) => {
      dispatch(setPriceRange(parseInt(e.target.value)));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (pageNumber) => {
      dispatch(setPage(pageNumber));
    },
    [dispatch]
  );

  const fetchTopRatedProduct = useCallback(async () => {
    try {
      const res = await getTopRatedProduct();
      setTopRated(res?.data?.data || []);
    } catch (error) {
      setFetchError("Failed to fetch top-rated products.");
      console.error("Error fetching top-rated product:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const categoryRes = await getCategory();
      setCategoryList(categoryRes.data.data);
    } catch (error) {
      setFetchError("Failed to fetch categories.");
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      setFetchError(null);
      await Promise.all([fetchTopRatedProduct(), fetchCategories()]);
      setIsFetching(false);
    };

    fetchData();
  }, [fetchTopRatedProduct, fetchCategories]);

  const getGridClass = () => {
    switch (grid) {
      case 2:
        return styles.productGrid2;
      case 4:
        return styles.productGrid4;
      case 3:
      default:
        return styles.productGrid3;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <Banner name={id?.toUpperCase() || "FOOD"} />

      <div className={styles.container}>
        <div className={styles.container2}>
          <FilterContainer
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            data={topRated}
            categoryList={categoryList}
          />

          {isFetching || loading ? (
            <div className="loadingContainer">
              <Loading />
            </div>
          ) : fetchError || error ? (
            <div className={styles.error}>
              {fetchError || `Error: ${error}`}
            </div>
          ) : (
            <div className={styles.mainContent}>
              <div className={styles.sortingBar}>
                <div className={styles.breadcrumb}>
                  <span aria-label="Breadcrumb">Home / Food</span>
                </div>

                <div className={styles.sortingOptions}>
                  <ShowProducts />
                  <div
                    className={styles.gridIcons}
                    role="group"
                    aria-label="Grid layout options"
                  >
                    <span
                      onClick={() => dispatch(setGrid(2))}
                      className={
                        grid === 2 ? styles.gridIconActive : styles.gridIcon
                      }
                    >
                      <IoGrid size={24} />
                    </span>
                    <span
                      onClick={() => dispatch(setGrid(3))}
                      className={
                        grid === 3 ? styles.gridIconActive : styles.gridIcon
                      }
                    >
                      <BsFillGrid3X3GapFill size={24} />
                    </span>
                    <span
                      onClick={() => dispatch(setGrid(4))}
                      className={
                        grid === 4 ? styles.gridIconActive : styles.gridIcon
                      }
                    >
                      <TfiLayoutGrid4Alt size={24} />
                    </span>
                  </div>
                </div>
              </div>

              <div className={getGridClass()}>
                {products?.data?.length > 0 ? (
                  products.data.map((product, index) => (
                    <ProductCard key={index} product={product} grid={grid} />
                  ))
                ) : (
                  <p className={styles.noProducts}>
                    No products found. Try adjusting your filters.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {products?.pages > 1 && (
          <Pagination
            currentPage={products?.page || 1}
            totalPages={products?.pages || 1}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FoodPage;
