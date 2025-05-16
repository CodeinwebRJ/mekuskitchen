// components/NoData.js
import styles from "../../styles/NoData.module.css";

const NoData = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.noDataIcon}>📭</div>
      <p className={styles.loadingText}>No Data Available</p>
    </div>
  );
};

export default NoData;
