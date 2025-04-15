import React, { useState } from "react";
import style from "../../styles/MyAccountContainer.module.css";
import { MyAccountData } from "../../StaticData";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../../component/Header";
import Banner from "../../Component/Banner";
import Footer from "../../Component/Footer";

const MyAccountContainer = ({ children }) => {
  const location = useLocation();
  const [active, setActive] = useState("Dashboard");

  const handleSideTitleClick = (title) => {
    setActive(title);
  };

  const pathname = location.pathname;

  console.log(pathname);
  console.log(MyAccountData);

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Banner */}
      <Banner name={"My Account"} />

      {/* Container */}
      <div className={style.myAccountContainer}>
        {/* Left Container */}
        <div className={style.myAccountLeftContainer}>
          <p className={style.myAccountLeftContainerTitle}>MY ACCOUNT</p>

          <div className={style.sideTitlesContainer}>
            {MyAccountData &&
              MyAccountData.map((item, index) => (
                <Link
                  key={index}
                  to={item.route}
                  className={
                    item.route === pathname
                      ? style.sideTitleActive
                      : style.sideTitle
                  }
                  onClick={() => handleSideTitleClick(item.title)}
                >
                  {item.title}
                </Link>
              ))}
          </div>
        </div>

        {/* Right Container */}
        <div className={style.myAccountRightContainer}>{children}</div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyAccountContainer;
