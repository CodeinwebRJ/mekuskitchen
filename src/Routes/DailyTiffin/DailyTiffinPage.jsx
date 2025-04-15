import React, { useEffect } from "react";
import style from "../../styles/DailyTiffinPage.module.css";
import Footer from "../../Component/Footer";
import Banner from "../../Component/Banner";
import TiffinCard from "../../UI/TiffinCard";
import { useSelector } from "react-redux";
import Header from "../../Component/Header";

const DailyTiffinPage = () => {
  const tiffin = useSelector((state) => state.tiffin);

  return (
    <div>
      <Header />
      <Banner name={"Daily Tiffin"} />
      <div className={style.TiffinContainer}>
        <div className={style.CustomiseTiffinContainer}>
          <div className={style.header}>
            <h3 className={style.headerTitle}>Customise Your Tiffin</h3>
          </div>

          <p className={style.note}>
            Please Note: All orders will accepted a day before only. For any
            query please call admin: +1(672)-377-4949
          </p>

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} path={`/product/${String(item?.day).toLowerCase()}`}/>
            ))}
          </div>
        </div>

        <div className={style.RegularTiffinContainer}>
          <div className={style.header}>
            <h3 className={style.headerTitle}>Order A Regular Tiffin</h3>
          </div>

          <p className={style.note}>
            Please Note: All orders will accepted a day before only. For any
            query please call admin: +1(672)-377-4949
          </p>

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} path={`/product/${String(item?.day).toLowerCase()}`}/>
            ))}
          </div>
        </div>

        <div className={style.BreakfastMenuContainer}>
          <div className={style.header}>
            <h3 className={style.headerTitle}>Breakfast Menu</h3>
          </div>

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>

        <div className={style.SweetsContainer}>
          <div className={style.header}>
            <h4 className={style.headerTitle}>Sweets</h4>
          </div>

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DailyTiffinPage;
