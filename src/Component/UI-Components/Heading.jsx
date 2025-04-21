import React from "react";
import style from "../../styles/Heading.module.css";

const Heading = (props) => {
  const { title, titleColor, note, size = "md", review } = props;

  return (
    <>
      <div className={style.headingContainer}>
        <h1 className={`${style.title} ${style[size]}`}>
          {title}{" "}
          {titleColor && <span className={style.titleColor}>{titleColor}</span>}
          {review && { review }}
        </h1>
      </div>
      {note && <p className={style.note}>{note}</p>}
    </>
  );
};

export default Heading;
