import { useState } from "react";
import style from "../../styles/MyAccountContainer.module.css";
import { MyAccountData } from "../../StaticData";
import { Link, useLocation } from "react-router-dom";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";

const MyAccountContainer = ({ children }) => {
  const location = useLocation();
  const [active, setActive] = useState("Dashboard");

  const handleSideTitleClick = (title) => {
    setActive(title);
  };

  const pathname = location.pathname;

  return (
    <div>
      <Header />
      <Banner name={"My Account"} />
      <div className={style.myAccountContainer}>
        <div className={style.myAccountLeftContainer}>
          <div className={style.myAccountLeftContainerSticky}>
            <p className={style.myAccountLeftContainerTitle}>MY ACCOUNT</p>

            <div className={style.sideTitlesContainer}>
              {MyAccountData?.map((item, index) => (
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
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
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
