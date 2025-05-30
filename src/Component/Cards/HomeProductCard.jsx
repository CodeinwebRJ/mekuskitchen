import { FaPlus, FaShoppingBag } from "react-icons/fa";
import style from "../../styles/HomeProductCard.module.css";
import { Link } from "react-router-dom";

export const HomeProductCard = ({
  data,
  image,
  name,
  subtitle,
  price,
  alt,
}) => {
  const imageUrl =
    Array.isArray(image) && image.length > 0 && image[0]?.url
      ? image[0].url
      : "https://via.placeholder.com/150";

  console.log(data);
  return (
    <Link
      to={`/product/${data?.category?.toLowerCase()}/${data?.name?.toLowerCase()}`}
      state={{ id: data?._id }}
    >
      <div className={style.card}>
        <div className={style.imgeContainer}>
          <img
            src={imageUrl}
            alt={alt || "Product image"}
            className={style.image}
            loading="lazy"
          />
        </div>
        <div className={style.cardContent}>
          <div className={style.content}>
            <h3 className={style.title}>{name || "Unnamed Product"}</h3>
            {subtitle && <p className={style.subtitle}>{subtitle}</p>}
            {price && <p className={style.price}>${price.toFixed(2)}</p>}
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
    </Link>
  );
};
