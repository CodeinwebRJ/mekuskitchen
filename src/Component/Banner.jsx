import React from "react";
import style from "../styles/Banner.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const Banner = (props) => {
  const { name } = props;

  const foodImages = [
    {
      src: "/dabeli.png",
      alt: "Food Item",
    },
    {
      src: "/samosa.png",
      alt: "Food Item",
    },
    {
      src: "/dosa.png",
      alt: "Food Item",
    },
    {
      src: "/chole.png",
      alt: "Food Item",
    },
  ];

  return (
    <div className={style.banner}>
      <div className={style.foodImages}>
        {foodImages.map((image, index) => (
          <div className={style.imagesContainer} key={index}>
            <img
              key={index}
              src={image.src}
              alt={`${image.alt} ${index + 1}`}
              className={style.foodItem}
            />
          </div>
        ))}
      </div>

      <h1 className={style.bannerText}>
        {name === "FOOD" || name === "GROCERY" ? (
          <Link to={"/"} className={style.arrow}>
            <BsArrowLeft />
          </Link>
        ) : null}

        {name}
      </h1>

      {name !== "FOOD" || name !== "GROCERY" ? (
        <div className={style.bannerBreadcrumb}>
          <Link to={"/"} className={style.link}>
            Home
          </Link>
          /<span className={style.currentPage}>{name}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Banner;
