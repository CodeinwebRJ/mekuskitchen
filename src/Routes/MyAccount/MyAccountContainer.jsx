import React from "react";
import style from "../../styles/MyAccountContainer.module.css";

const MyAccountContainer = (props) => {
  const { children } = props;

  return (
    <div className={style.myAccountContainer}>
      <div className={style.myAccountContainerLeft}>
        
      </div>

      <div className={style.myAccountContainerRight}>{children}</div>
    </div>
  );
};

export default MyAccountContainer;
