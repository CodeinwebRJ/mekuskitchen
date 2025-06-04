import { Link } from "react-router-dom";
import Footer from "../../Component/MainComponents/Footer";
import Header from "../../Component/MainComponents/Header";
import style from "../../styles/Orderplaced.module.css";

const OrderPlaced = () => {
  return (
    <>
      <Header />
      <div className={style.wrapper}>
        <div className={style.card}>
          <div className={style.iconWrapper}>
            <div className={style.checkIcon}>✔</div>
            <div className={style.confetti}></div>
          </div>
          <h2>Thank you for ordering!</h2>
          <p>Your order was placed successfully.</p>
          <div className={style.buttonGroup}>
            <Link to="/product-category">
              <button className={style.continueBtn}>Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default OrderPlaced;
