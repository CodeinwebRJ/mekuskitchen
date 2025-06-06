import style from "../../styles/Banner.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const Banner = ({ name, path = "/" }) => {
  const foodImages = useMemo(
    () => [
      { src: "/dabeli.png", alt: "Dabeli dish" },
      { src: "/samosa.png", alt: "Samosa snack" },
      { src: "/dosa.png", alt: "Dosa crepe" },
      { src: "/chole.png", alt: "Chole curry" },
    ],
    []
  );

  const showBreadcrumb = name !== "FOOD" && name !== "GROCERY";

  return (
    <section className={style.banner} aria-label={`${name} banner`}>
      <div className={style.foodImages} aria-hidden="true">
        {foodImages.map((image, index) => (
          <div className={style.imagesContainer} key={`${image.alt}-${index}`}>
            <img
              src={image.src}
              alt={image.alt}
              className={style.foodItem}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/fallback.png"; // Fallback image
              }}
            />
          </div>
        ))}
      </div>

      <h1 className={style.bannerText}>
        <Link
          to={path}
          className={style.arrow}
          aria-label={`Back to ${path === "/" ? "home" : "previous page"}`}
        >
          <BsArrowLeft />
        </Link>
        {name}
      </h1>

      {showBreadcrumb && (
        <nav className={style.bannerBreadcrumb} aria-label="Breadcrumb">
          <Link to="/" className={style.link}>
            Home
          </Link>
          <span className={style.breadcrumbSeparator}>/</span>
          <span className={style.currentPage}>{name}</span>
        </nav>
      )}
    </section>
  );
};

export default Banner;
