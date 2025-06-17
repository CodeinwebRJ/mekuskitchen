import React, { useState } from "react";
import style from "../../styles/MyAccountContainer.module.css";
import { MyAccountData } from "../../StaticData";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Banner from "../../Component/MainComponents/Banner";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { logout } from "../../../Store/Slice/UserSlice";

const MyAccountContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Added dispatch
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [active, setActive] = useState("Dashboard");

  const handleSideTitleClick = (title) => {
    console.log(title);
    if (isAuthenticated === true && title === "Logout") {
      console.log("object");
      dispatch(logout());
      navigate("/login");
    } else {
      navigate("/login");
    }
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
                  {item.icon}{" "}
                  {item.title === "Logout" && !isAuthenticated
                    ? "Login"
                    : item.title}
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
