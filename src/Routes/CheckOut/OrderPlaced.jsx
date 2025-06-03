import style from "../../styles/Orderplaced.module.css";

const OrderPlaced = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.card}>
        <div className={style.iconWrapper}>
          <div className={style.checkIcon}>✔</div>
          <div className={style.confetti}></div>
        </div>
        <h2>Thank you for ordering!</h2>
        <p>Your order was placed successfully.</p>
        <div className={style.buttonGroup}>
          <button className={style.continueBtn}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};
export default OrderPlaced;
