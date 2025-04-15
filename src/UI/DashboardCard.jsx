import React from "react";
import style from "../styles/DashboardCard.module.css";
import { Link } from "react-router-dom";

const DashboardCard = (props) => {
  const { title, icon, route } = props;

  return (
    <Link to={route} className={style.cardContainer}>
      <div className={style.cardIcon}>{icon}</div>

      <p className={style.cardIconText}>{title}</p>
    </Link>
  );
};

export default DashboardCard;
