import React, { useEffect } from "react";
import style from "../../styles/DailyTiffinPage.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import TiffinCard from "../../Component/Cards/TiffinCard";
import { useSelector } from "react-redux";
import Header from "../../Component/MainComponents/Header";
import Heading from "../../Component/UI-Components/Heading";

const DailyTiffinPage = () => {
  const tiffin = useSelector((state) => state.tiffin);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner name={"Daily Tiffin"} />

      {/* Tiffin Container */}
      <div className={style.TiffinContainer}>
        <div className={style.CustomiseTiffinContainer}>
          <Heading
            title="Customise Your Tiffin"
            note="Please Note: All orders will accepted a day before only. For any
            query please call admin: +1(672)-377-4949"
            size="sm"
          />

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard
                key={index}
                item={item}
                path={`/product/tiffin/${String(item?.day).toLowerCase()}`}
              />
            ))}
          </div>
        </div>

        <div className={style.RegularTiffinContainer}>
          <Heading
            title="Order A Regular Tiffin"
            note="Please Note: All orders will accepted a day before only. For any
              query please call admin: +1(672)-377-4949"
            size="sm"
          />

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard
                key={index}
                item={item}
                path={`/product/tiffin/${String(item?.day).toLowerCase()}`}
              />
            ))}
          </div>
        </div>

        <div className={style.BreakfastMenuContainer}>
          <Heading
            title="Breakfast Menu"
            note="Please Note: All orders will accepted a day before only. For any
              query please call admin: +1(672)-377-4949"
            size="sm"
          />

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>

        <div className={style.SweetsContainer}>
        <Heading
            title="Sweets"
            note="Please Note: All orders will accepted a day before only. For any
              query please call admin: +1(672)-377-4949"
            size="sm"
          />

          <div className={style.TiffinCardContainer}>
            {tiffin.tiffins?.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DailyTiffinPage;
