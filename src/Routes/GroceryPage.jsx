import React from "react";
import Banner from "../Component/Banner";
import Header from "../component/Header";
import style from "../styles/Food.module.css";
import { IoGrid } from "react-icons/io5";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPriceRange, setGrid } from "../../Store/Slice/FoodSlice";

const GroceryPage = () => {
  const { products, priceRange, grid, loading, error } = useSelector(
    (state) => state.grocery
  );

  const dispatch = useDispatch();

  const handlePriceChange = (e) => {
    dispatch(setPriceRange(parseInt(e.target.value)));
  };

  const topRatedProducts = [
    {
      name: "Dabeli",
      price: 10.0,
      img: "https://t3.ftcdn.net/jpg/11/24/50/08/360_F_1124500825_NcC7IbjwscnJmlbzTzEHLtt0eQKigu9r.jpg",
      rating: 5,
    },
    {
      name: "Live Mohanthal",
      price: 6.0,
      img: "https://t3.ftcdn.net/jpg/11/24/50/08/360_F_1124500825_NcC7IbjwscnJmlbzTzEHLtt0eQKigu9r.jpg",
      rating: 4,
    },
    {
      name: "Bread Pakoda",
      price: 12.0,
      img: "https://t3.ftcdn.net/jpg/11/24/50/08/360_F_1124500825_NcC7IbjwscnJmlbzTzEHLtt0eQKigu9r.jpg",
      rating: 3,
    },
  ];

  return (
    <div>
      <Header />
      <Banner name={"Grocery"} />
      <div className={style.container}>
        <div className={style.container2}>
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
                {topRatedProducts.map((product, index) => (
                  <div key={index}>
                    <li className={style.topRatedItem}>
                      <img
                        src={product.img}
                        alt={product.name}
                        className={style.topRatedImg}
                      />
                      <div className={style.topRatedInfo}>
                        <p>{product.name}</p>
                        <div className={style.rating}>
                          <span>★</span>
                        </div>
                        <p className={style.topRatedPrice}>
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                    <hr />
                  </div>
                ))}
              </ul>
            </div>
          </aside>
          <div className={style.mainContent}>
            <div className={style.sortingBar}>
              <div className={style.breadcrumb}>
                <span>Home / Food</span>
              </div>
              <div className={style.sortingOptions}>
                <div className={style.showOptions}>
                  <span>SHOW: </span>
                  <span>9 / 12 / 18 / 24</span>
                </div>
                <div className={style.gridIcons}>
                  <span onClick={() => dispatch(setGrid(2))}>
                    <IoGrid size={24} />
                  </span>
                  <span onClick={() => dispatch(setGrid(3))}>
                    <BsFillGrid3X3GapFill size={24} />
                  </span>
                  <span onClick={() => dispatch(setGrid(4))}>
                    <TfiLayoutGrid4Alt size={24} />
                  </span>
                </div>
                <select>
                  <option>Default sorting</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
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
                  <Link
                    to={`/product/${product?.category.toLowerCase()}/${product.product_name.toLowerCase()}`}
                    state={{ id: product._id }}
                    key={index}
                  >
                    <div className={style.productCard}>
                      <img
                        src={product.image_url?.[0] || ""}
                        alt={product.product_name}
                        className={
                          grid === 2
                            ? style.productImg2
                            : grid === 3
                            ? style.productImg3
                            : grid === 4
                            ? style.productImg4
                            : style.productImg3
                        }
                      />
                      <h3>{product.product_name}</h3>
                      <div className={style.rating}>
                        <span>★</span>
                      </div>
                      <p className={style.price}>${product.price}</p>
                      <button className={style.addToCart}>ADD TO CART</button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroceryPage;
