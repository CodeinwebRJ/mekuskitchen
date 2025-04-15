import React from "react";
import style from "../styles/DashboardCard.module.css";

const DashboardCard = (props) => {
  const { title, icon, handleCardClick } = props;

  return (
    <div className={style.cardContainer} onClick={() => handleCardClick(title)}>
      <div className={style.cardIcon}>{icon}</div>

      <p className={style.cardIconText}>{title}</p>
    </div>
  );
};

export default DashboardCard;
