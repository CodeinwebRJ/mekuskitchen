import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategory,
  getTopRatedProduct,
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
import { setGrid, setPage } from "../../../Store/Slice/FilterDataSlice.jsx";
import NoDataFound from "../../Component/MainComponents/NoDataFound.jsx";

const FoodPage = () => {
  const [topRated, setTopRated] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  const { price, grid } = useSelector((state) => state.filterData);

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
      try {
        await Promise.all([fetchTopRatedProduct(), fetchCategories()]);
      } catch (error) {
        console.error("Error during data fetch", error);
      } finally {
        setIsFetching(false);
      }
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

  const isDataReady =
    !loading &&
    !isFetching &&
    !fetchError &&
    !error &&
    products?.data &&
    Array.isArray(topRated) &&
    Array.isArray(categoryList);

  if (fetchError || error) {
    return (
      <div className={styles.error}>{fetchError || `Error: ${error}`}</div>
    );
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [products?.page]);

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <Banner name={"Product"} />

      <div className={styles.container}>
        <div className={styles.container2}>
          <FilterContainer
            priceRange={price}
            data={topRated}
            categoryList={categoryList}
          />

          {!isDataReady ? (
            <div className="loadingContainer">
              <Loading />
            </div>
          ) : (
            <div className={styles.mainContent}>
              <div className={styles.sortingBar}>
                <div className={styles.breadcrumb}>
                  <Link to={"/"} className={styles.homeLink}>
                    Home /{" "}
                  </Link>
                  <span>Food</span>
                </div>
                <div className={styles.sortingOptions}>
                  <div className={styles.showProducts}>
                    <ShowProducts />
                  </div>
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

              <div>
                {products?.data?.length > 0 ? (
                  <div className={getGridClass()}>
                    {products.data.map((product, index) => (
                      <ProductCard key={index} product={product} grid={grid} />
                    ))}
                  </div>
                ) : (
                  <div>
                    <NoDataFound />
                  </div>
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
