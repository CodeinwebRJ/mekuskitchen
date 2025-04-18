import React, { useEffect } from "react";
import style from "../../styles/WishlistPage.module.css";
import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import Banner from "../../Component/Banner";
import { RiShareLine } from "react-icons/ri";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import WishlistItem from "../../Component/WishlistItem";
import FilterAndShorting from "../../UI/FilterAndShorting";

const WishlistPage = () => {
  const products = useSelector((state) => state.cart?.items?.items);

  const filterAndShortingOptions = [
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

  return (
    <div>
      {/* header */}
      <Header />

      {/* banner */}
      <Banner name="Wishlist" />

      {/* wishlist */}
      <div className={style.wishlistContainer}>
        <div className={style.headingContainer}>
          <h3 className={style.headingTitle}>Your Wishlist</h3>

          <div className={style.headerContainer}>
            <div className={style.headerLeftSide}>
              {/* <p>Shoppinglist</p> */}
            </div>

            <div className={style.headerRightSide}>
              <RiShareLine className={style.icon} />

              <IoReorderThreeOutline
                className={`${style.icon} ${style.listIcon}`}
              />

              <FilterAndShorting
                options={filterAndShortingOptions}
                placeholder="Filter & Short"
              />
            </div>
          </div>
        </div>

        {products &&
          products.map((product, index) => (
            <WishlistItem key={index} product={product} />
          ))}
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default WishlistPage;
