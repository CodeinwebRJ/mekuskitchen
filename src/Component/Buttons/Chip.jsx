import style from "../../styles/Chip.module.css";

const Chip = ({ name }) => {
  return <div className={style.chip}>{name}</div>;
};

export default Chip;
