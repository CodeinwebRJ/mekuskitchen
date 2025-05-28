import { FaPlus, FaShoppingBag } from "react-icons/fa";
import style from "../../styles/HomeProductCard.module.css";

export const HomeProductCard = ({ image, title, subtitle, price, actions }) => {
  return (
    <div className={style.card}>
      <div className={style.imgeContainer}>
        <img
          src={image}
          alt={title || "Product image"}
          className={style.image}
        />
      </div>
      <div className={style.cardContent}>
        <div className={style.content}>
          <h3 className={style.title}>{title}</h3>
          {subtitle && <p className={style.subtitle}>{subtitle}</p>}
          {price && <p className={style.price}>${price}</p>}
        </div>
        <div className={style.actions}>
          <button className={style.iconBtn} title="Add">
            <FaPlus />
          </button>
          <button className={style.iconBtn} title="Buy Now">
            <FaShoppingBag />
          </button>
        </div>
      </div>
    </div>
  );
};
