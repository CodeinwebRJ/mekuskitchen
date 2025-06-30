import { Link } from "react-router-dom";
import styles from "../../styles/Banner2.module.css";

function Banner2(props) {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>{props.title}</h1>
        <div className={styles.breadcrumb}>
          <Link className={styles.breadcrumbLink} to={props.path}>
            {props.name}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Banner2;
