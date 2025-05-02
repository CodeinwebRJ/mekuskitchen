import React, { useEffect, useState } from "react";
import style from "../../styles/Food.module.css";
import Banner from "../../Component/MainComponents/Banner";
import { IoGrid } from "react-icons/io5";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setPriceRange,
  setGrid,
  setPage,
} from "../../../Store/Slice/ProductSlice.jsx";
import Footer from "../../Component/MainComponents/Footer";
import ProductCard from "../../Component/Cards/ProductCard.jsx";
import FilterContainer from "../../Component/FilterContainer.jsx";
import ShowProducts from "../../Component/ShowProducts";
import {
  getTopRatedProduct,
  getUserWishlist,
} from "../../axiosConfig/AxiosConfig.js";
import Header from "../../Component/MainComponents/Header";
import Pagination from "../../Component/Pagination.jsx";
import Loading from "../../Component/UI-Components/Loading.jsx";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice.jsx";

const FoodPage = () => {
  const [topRated, setTopRated] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { priceRange, grid, loading, error, products } = useSelector(
    (state) => state.product
  );

  const handlePriceChange = (e) => {
    dispatch(setPriceRange(parseInt(e.target.value)));
  };

  const fetchTopRatedProduct = async () => {
    try {
      const res = await getTopRatedProduct();
      setTopRated(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching top rated product", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      console.log("object");
      const res = await getUserWishlist(user.userid);
      console.log(res);
      dispatch(setWishlist(res.data.data));
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    dispatch(setPage(pageNumber));
  };

  useEffect(() => {
    fetchTopRatedProduct();
    fetchWishlist();
  }, []);

  return (
    <div>
      <Header />
      <Banner name={id?.toUpperCase() || "FOOD"} />

      <div className={style.container}>
        <div className={style.container2}>
          <FilterContainer
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            data={topRated}
          />

          {loading ? (
            <div className="loadingContainer">
              <Loading />
            </div>
          ) : error ? (
            <div className={style.error}>Error: {error}</div>
          ) : (
            <div className={style.mainContent}>
              <div className={style.sortingBar}>
                <div className={style.breadcrumb}>
                  <span>Home / Food</span>
                </div>

                <div className={style.sortingOptions}>
                  <ShowProducts />

                  <div className={style.gridIcons}>
                    <span onClick={() => dispatch(setGrid(2))}>
                      <IoGrid
                        size={24}
                        className={
                          grid === 2 ? style.gridIconActive : style.gridIcon
                        }
                      />
                    </span>
                    <span onClick={() => dispatch(setGrid(3))}>
                      <BsFillGrid3X3GapFill
                        size={24}
                        className={
                          grid === 3 ? style.gridIconActive : style.gridIcon
                        }
                      />
                    </span>
                    <span onClick={() => dispatch(setGrid(4))}>
                      <TfiLayoutGrid4Alt
                        size={24}
                        className={
                          grid === 4 ? style.gridIconActive : style.gridIcon
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={
                  grid === 2
                    ? style.productGrid2
                    : grid === 3
                    ? style.productGrid3
                    : grid === 4
                    ? style.productGrid4
                    : style.productGrid3
                }
              >
                {products?.data?.length > 0 ? (
                  products.data.map((product, index) => (
                    <ProductCard key={index} product={product} grid={grid} />
                  ))
                ) : (
                  <p className={style.noProducts}>No products found.</p>
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
