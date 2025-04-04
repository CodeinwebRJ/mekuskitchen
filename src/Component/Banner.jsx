import React from "react";
import style from "../styles/Banner.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const Banner = ({ name }) => {
  const foodImages = [
    {
      src: "https://cdn.pixabay.com/photo/2024/01/29/21/50/ai-generated-8540840_640.jpg",
      alt: "Food Item",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxmhdxg2hJqHRit2iNKKD7cTrVe7y3CKyySg&s",
      alt: "Food Item",
    },
    {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcB65vTPvWrMKGMJCmHpK1qIpqX4TznWRG4A&s",
      alt: "Food Item",
    },
    {
      src: "https://cdn.pixabay.com/photo/2024/01/29/21/50/ai-generated-8540840_640.jpg",
      alt: "Food Item",
    },
  ];

  return (
    <div className={style.banner}>
      <div className={style.foodImages}>
        {foodImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={`${image.alt} ${index + 1}`}
            className={style.foodItem}
          />
        ))}
      </div>

      <h1 className={style.bannerText}>
        <Link to={"/"} className={style.arrow}>
          <BsArrowLeft />
        </Link>
        {name}
      </h1>
    </div>
  );
};

export default Banner;
