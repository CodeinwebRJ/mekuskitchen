import styles from "../../styles/Features.module.css";
import { FaTruck, FaShieldAlt, FaTrophy } from "react-icons/fa";
import { MdReplay } from "react-icons/md";

const Features = () => {
  const features = [
    {
      icon: <MdReplay size={24} className={styles.icon} />,
      label: "7 days Replacement",
    },
    {
      icon: <FaTruck size={24} className={styles.icon} />,
      label: "Free Delivery",
    },
    {
      icon: <FaShieldAlt size={24} className={styles.icon} />,
      label: "1 Year Warranty",
    },
    {
      icon: <FaTrophy size={24} className={styles.icon} />,
      label: "Top Brand",
    },
  ];

  return (
    <div className={styles.container}>
      {features.map((feature, index) => (
        <div className={styles.feature} key={index}>
          <div className={styles.iconContainer}>{feature.icon}</div>
          <p>{feature.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
