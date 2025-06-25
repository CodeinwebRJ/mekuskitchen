import style from "../../styles/Heading.module.css";

const Heading = ({ title, titleColor, note, size = "md", review }) => {
  return (
    <>
      <div className={style.headingContainer}>
        <h1 className={`${style.title} ${style[size]}`}>
          {title}{" "}
          {titleColor && <span className={style.titleColor}>{titleColor}</span>}
          {review && <span className={style.review}>{review}</span>}
        </h1>
      </div>
      {note && <p className={style.note}>{note}</p>}
    </>
  );
};

export default Heading;
