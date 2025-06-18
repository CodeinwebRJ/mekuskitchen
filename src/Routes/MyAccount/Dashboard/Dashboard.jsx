import React from "react";
import style from "../../../styles/Dashboard.module.css";
import DashboardCard from "../../../Component/Cards/DashboardCard";
import { MyAccountData } from "../../../StaticData";
import MyAccountContainer from "../MyAccountContainer";

const Dashboard = () => {
  return (
    <MyAccountContainer>
      <div className={style.dashboardContainer}>
        {/* <p className={style.userMessage}>
          Hello <span className={style.userName}>bharat.mbinfoways</span> (not{" "}
          <span className={style.userName}>bharat.mbinfoways</span>? Log out)
        </p>

        <p className={style.userMessage}>
          From your account dashboard you can view your recent orders, manage
          your shipping and billing addresses, and edit your password and
          account details.
        </p> */}

        <div className={style.dashboardCardContainer}>
          {MyAccountData.slice(1).map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              icon={item.icon}
              route={item.route}
            />
          ))}
        </div>
      </div>
    </MyAccountContainer>
  );
};

export default Dashboard;
