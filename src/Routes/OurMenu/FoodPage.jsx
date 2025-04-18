import React, { useEffect, useState } from "react";
import style from "../../styles/Food.module.css";
import Banner from "../../Component/Banner";
import { IoGrid } from "react-icons/io5";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, setGrid } from "../../../Store/Slice/ProductSlice.jsx";
import Footer from "../../Component/Footer";
import ProductCard from "../../UI/ProductCard";
import FilterContainer from "../../Component/FilterContainer.jsx";
import ShowProducts from "../../Component/ShowProducts";
import { getTopRatedProduct } from "../../axiosConfig/AxiosConfig.js";
import Header from "../../Component/Header";
import FilterAndShorting from "../../UI/FilterAndShorting.jsx";

const FoodPage = () => {
  const [toprated, setTopRated] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const { priceRange, grid, loading, error } = useSelector(
    (state) => state.product
  );

  const { products } = useSelector((state) => state.product);

  const sortingOption = [
    {
      id: 1,
      label: "Sort by price: low to high",
      value: "priceLowToHigh",
    },
    {
      id: 2,
      label: "Sort by price: high to low",
      value: "priceHighToLow",
    },
  ];

  const handlePriceChange = (e) => {
    dispatch(setPriceRange(parseInt(e.target.value)));
  };

  const fetchTopratedProduct = async () => {
    try {
      const res = await getTopRatedProduct();
      setTopRated(res?.data?.data);
      console.log(res?.data?.data);
    } catch (error) {
      console.error("Error fetching top rated product", error);
    }
  };

  useEffect(() => {
    fetchTopratedProduct();
  }, []);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner name={id.toUpperCase()} />

      {/* Container */}
      <div className={style.container}>
        <div className={style.container2}>
          {/* Filter Container */}
          <FilterContainer
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            data={toprated}
          />

          {/* Main Content */}
          <div className={style.mainContent}>
            <div className={style.sortingBar}>
              <div className={style.breadcrumb}>
                <span>Home / Food</span>
              </div>
              <div className={style.sortingOptions}>
                {/* Show Products */}
                <ShowProducts />

                {/* Grid Icons */}
                <div className={style.gridIcons}>
                  <span onClick={() => dispatch(setGrid(2))}>
                    <IoGrid
                      size={24}
                      className={
                        grid === 2 ? style.gridIconActive : style.gridIcon
                      }
                    />
                  </span>
                  <span
                    onClick={(e) => {
                      dispatch(setGrid(3));
                    }}
                  >
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

                {/* Sorting */}
                <FilterAndShorting
                  options={sortingOption}
                  placeholder="Default sorting"
                />
              </div>
            </div>
            {loading ? (
              <p className={style.loading}>Loading...</p>
            ) : error ? (
              <p className={style.error}>Error: {error}</p>
            ) : (
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
                {products?.data?.map((product, index) => (
                  <ProductCard key={index} product={product} grid={grid} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FoodPage;
