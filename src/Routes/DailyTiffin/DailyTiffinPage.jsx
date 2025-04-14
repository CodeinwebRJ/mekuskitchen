import React, { useEffect } from "react";
import style from "../../styles/DailyTiffinPage.module.css";
import Footer from "../../Component/Footer";
import Banner from "../../Component/Banner";
import TiffinCard from "../../UI/TiffinCard";
import {
  CustomiseTiffinData,
  RegularTiffinData,
  BreakfastMenuData,
  SweetsData,
} from "../../StaticData";
import Header from "../../component/Header";
import { Link } from "react-router-dom";
import { getAllTiffin } from "../../axiosConfig/AxiosConfig";

const DailyTiffinPage = () => {
  const product = {
    title: "Monday",
    image: "/tiffin.png",
    price: 15,
    description: "This is a daily tiffin",
  };

  const fetchTiffin = async () => {
    try {
      data = {
        Active: true,
      };
      const res = await getAllTiffin(data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTiffin();
  }, []);

  return (
    <div>
      <Header />

      {/* banner */}
      <Banner name={"Daily Tiffin"} />
      <div className={style.TiffinContainer}>
        {/* customise tiffin */}
        <div className={style.CustomiseTiffinContainer}>
          {/* header */}
          <div className={style.header}>
            <h3 className={style.headerTitle}>Customise Your Tiffin</h3>
          </div>

          {/* note */}
          <p className={style.note}>
            Please Note: All orders will accepted a day before only. For any
            query please call admin: +1(672)-377-4949
          </p>

          <div className={style.TiffinCardContainer}>
            {CustomiseTiffinData.map((item, index) => (
              <Link
                to={`/product/custom/${product.title.toLowerCase()}`}
                state={{ id: product.id }}
              >
                <TiffinCard key={index} item={item} />
              </Link>
            ))}
          </div>
        </div>

        {/* regular tiffin */}
        <div className={style.RegularTiffinContainer}>
          {/* header */}
          <div className={style.header}>
            <h3 className={style.headerTitle}>Order A Regular Tiffin</h3>
          </div>

          {/* note */}
          <p className={style.note}>
            Please Note: All orders will accepted a day before only. For any
            query please call admin: +1(672)-377-4949
          </p>

          <div className={style.TiffinCardContainer}>
            {RegularTiffinData.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Breakfast Menu */}
        <div className={style.BreakfastMenuContainer}>
          {/* header */}
          <div className={style.header}>
            <h3 className={style.headerTitle}>Breakfast Menu</h3>
          </div>

          <div className={style.TiffinCardContainer}>
            {BreakfastMenuData.map((item, index) => (
              <TiffinCard key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Sweets */}
        <div className={style.SweetsContainer}>
          {/* header */}
          <div className={style.header}>
            <h4 className={style.headerTitle}>Sweets</h4>
          </div>

          <div className={style.TiffinCardContainer}>
            {SweetsData.map((item, index) => (
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
