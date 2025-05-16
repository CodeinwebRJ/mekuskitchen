import style from "../../styles/Chip.module.css";

const Chip = ({ name }) => {
  return <div className={style.chip}>{name.toUpperCase()}</div>;
};

export default Chip;
