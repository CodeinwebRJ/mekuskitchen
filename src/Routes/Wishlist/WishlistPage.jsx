import React, { useEffect, useState } from "react";
import style from "../../styles/WishlistPage.module.css";
import Header from "../../Component/MainComponents/Header";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import { RiShareLine } from "react-icons/ri";
import { IoReorderThreeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import WishlistItem from "../../Component/Cards/WishlistItemsCard";
import FilterAndShorting from "../../Component/UI-Components/FilterAndShorting";
import { getUserWishlist } from "../../axiosConfig/AxiosConfig";
import { setWishlist } from "../../../Store/Slice/UserWishlistSlice";

const WishlistPage = () => {
  const data = useSelector((state) => state.wishlist);

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
      <Header />
      <Banner name="Wishlist" />
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

        {data &&
          data?.items?.items?.map((product, index) => (
            <WishlistItem key={index} product={product} />
          ))}
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default WishlistPage;
