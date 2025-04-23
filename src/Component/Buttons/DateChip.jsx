import React from "react";
import styles from "../../styles/DateChip.module.css";
const DateChip = ({ name }) => {
  return <span className={styles.tiffinDate}>{name}</span>;
};
export default DateChip;
