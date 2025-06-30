import style from "../../styles/Banner.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const foodImages = [
  { src: "/dabeli.png", alt: "Dabeli dish" },
  { src: "/samosa.png", alt: "Samosa snack" },
  { src: "/dosa.png", alt: "Dosa crepe" },
  { src: "/chole.png", alt: "Chole curry" },
];

const Banner = ({ name, path = "/" }) => {
  const showBreadcrumb = name !== "FOOD" && name !== "GROCERY";

  const handleImageError = (e) => {
    e.target.src = "/defaultImage.png";
  };

  return (
    <section className={style.banner} aria-label={`${name} banner`}>
      <div className={style.foodImages} aria-hidden="true">
        {foodImages.map(({ src, alt }, index) => (
          <div
            className={style.imagesContainer}
            key={index}
            role="img"
            aria-label={alt}
          >
            <img
              src={src}
              alt={alt}
              className={style.foodItem}
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>

      <div className={style.bannerContent}>
        <h1 className={style.bannerText}>
          <Link
            to={path}
            className={style.arrow}
            aria-label={`Back to ${path === "/" ? "home" : "previous page"}`}
          >
            <BsArrowLeft />
          </Link>
          <span className={style.pageTitle}>{name}</span>
        </h1>

        {showBreadcrumb && (
          <nav className={style.bannerBreadcrumb} aria-label="Breadcrumb">
            <Link to="/" className={style.link}>
              Home
            </Link>
            <span className={style.breadcrumbSeparator}>/</span>
            <span className={style.currentPage} aria-current="page">
              {name}
            </span>
          </nav>
        )}
      </div>
    </section>
  );
};

export default Banner;
