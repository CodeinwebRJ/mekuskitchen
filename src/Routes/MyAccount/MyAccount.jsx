import React, { useState } from "react";
import style from "../../styles/MyAccount.module.css";
import Footer from "../../Component/MainComponents/Footer";
import Banner from "../../Component/MainComponents/Banner";
import Dashboard from "./Dashboard/Dashboard";
import { MyAccountData } from "../../StaticData";
import Orders from "./Orders/Orders";
import Addresses from "./Addresses/Addresses";
import Downloads from "./Downloads/Downloads";
import AccountDetails from "./AccountDetails/AccountDetails";
import Header from "../../Component/MainComponents/Header";

const MyAccount = () => {
  const [active, setActive] = useState("Dashboard");
  const sideTitles = MyAccountData.map((item) => item.title);

  const handleSideTitleClick = (title) => {
    setActive(title);
  };

  return (
    <div>
      <Header />

      <Banner name={"My Account"} />

      {/* Container */}
      <div className={style.myAccountContainer}>
        <div className={style.myAccountLeftContainer}>
          <p className={style.myAccountLeftContainerTitle}>MY ACCOUNT</p>

          <div className={style.sideTitlesContainer}>
            {sideTitles &&
              sideTitles.map((title, index) => (
                <p
                  key={index}
                  className={
                    title === active ? style.sideTitleActive : style.sideTitle
                  }
                  onClick={() => handleSideTitleClick(title)}
                >
                  {title}
                </p>
              ))}
          </div>
        </div>

        <div className={style.myAccountRightContainer}>
          {active === "Dashboard" && <Dashboard setActive={setActive} />}

          {active === "Orders" && <Orders setActive={setActive} />}

          {/* {active === "Downloads" && <Downloads setActive={setActive} />} */}

          {active === "Addresses" && <Addresses setActive={setActive} />}

          {active === "Account Details" && (
            <AccountDetails setActive={setActive} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyAccount;
