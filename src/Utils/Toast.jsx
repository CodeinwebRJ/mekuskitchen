import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = ({
  message,
  type = "default",
  position = "top-center",
  autoClose = 3000,
}) => {
  toast(message, {
    type,
    position,
    autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
