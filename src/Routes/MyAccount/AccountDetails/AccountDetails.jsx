import MyAccountContainer from "../MyAccountContainer";
import styles from "../../../styles/AccountDetails.module.css";
import { useSelector } from "react-redux";

const AccountDetails = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <MyAccountContainer>
      <div className={styles.container}>
        <h2 className={styles.heading}>Account Details</h2>
        <div className={styles.card}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>
              {user?.first_name} {user?.last_name}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Mobile:</span>
            <span className={styles.value}>{user?.mobile}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user?.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Referral Code:</span>
            <span className={styles.value}>{user?.refcode}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>ET Coins:</span>
            <span className={styles.value}>{user?.et_coins}</span>
          </div>
        </div>
      </div>
    </MyAccountContainer>
  );
};

export default AccountDetails;
