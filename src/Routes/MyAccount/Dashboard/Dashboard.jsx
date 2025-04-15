import React from "react";
import style from "../../../styles/Dashboard.module.css";
import DashboardCard from "../../../UI/DashboardCard";
import { MyAccountData } from "../../../StaticData";

const Dashboard = (props) => {
  const { setActive } = props;

  const handleCardClick = (title) => {
    setActive(title);
  };

  return (
    <div className={style.dashboardContainer}>
      <p className={style.userMessage}>
        Hello <span className={style.userName}>bharat.mbinfoways</span> (not{" "}
        <span className={style.userName}>bharat.mbinfoways</span>? Log out)
      </p>

      <p className={style.userMessage}>
        From your account dashboard you can view your recent orders, manage your
        shipping and billing addresses, and edit your password and account
        details.
      </p>

      <div className={style.dashboardCardContainer}>
        {MyAccountData.slice(1).map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            icon={item.icon}
            handleCardClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
