import styles from "../../styles/NoDataFound.module.css";

const NoDataFound = ({ message = "No Data Found" }) => {
  return (
    <div className={styles.container}>
      <img src="/Notfound.gif" alt="No Data" className={styles.image} />
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default NoDataFound;
