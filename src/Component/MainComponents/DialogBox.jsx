import { useEffect } from "react";
import style from "../../styles/DialogBox.module.css";
import { IoClose } from "react-icons/io5";

const DialogBox = ({ isOpen, title, children, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={style.dialogoverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className={style.dialogbox}>
        <div className={style.dialogboxheader}>
          <h2 id="dialog-title" className={style.dialogtitle}>
            {title}
          </h2>
          <span
            className={style.closeicon}
            onClick={onClose}
            role="button"
            aria-label="Close"
          >
            <IoClose size={24} />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DialogBox;
