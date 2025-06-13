import { Link } from "react-router-dom";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/PaymentFail.module.css";
import { IoClose } from "react-icons/io5";

const PaymentFail = ({ setShowComponent }) => {
  return (
    <>
      <Header />
      <div className={style.wrapper}>
        <div className={style.card}>
          <div className={style.iconWrapper}>
            <div className={style.crossIcon}>
              <IoClose />
            </div>
          </div>
          <h2>Payment Failed</h2>
          <p>Sorry, your payment could not be processed.</p>
          <div className={style.buttonGroup}>
            <button
              onClick={() => setShowComponent("payment")}
              className={style.retryBtn}
            >
              Retry Payment
            </button>
            <Link to="/cart">
              <button className={style.continueBtn}>Go to Cart</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentFail;
