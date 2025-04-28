import styles from "../styles/Pagination.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={handlePrev}
        disabled={Number(currentPage) === 1}
        className={styles.pageButton}
      >
        <FaArrowLeft />
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${styles.pageButton} ${
            Number(currentPage) === number ? styles.active : ""
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={Number(currentPage) === totalPages}
        className={styles.pageButton}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
