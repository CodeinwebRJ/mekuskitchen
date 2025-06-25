import { useLocation } from "react-router-dom";
import style from "../../styles/AddressCard.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const AddressCard = ({
  address,
  handleUpdateAddress,
  handleDeleteAddress,
  handleSetAsDefaultAddress,
}) => {
  const location = useLocation();
  return (
    <div
      className={`${style.addressCardContainer} ${
        address?.isActive ? style.addressCardContainerActive : ""
      }`}
    >
      <div
        onClick={() => {
          handleSetAsDefaultAddress(address?._id);
        }}
        className={style.addressCard}
      >
        <h1 className={style.fullName}>{address?.billing?.name}</h1>
        <p className={style.address}>{address?.address}</p>
        <p className={style.address}>
          {address?.billing?.city}, {address?.billing?.state}
        </p>
        <p className={style.address}>
          {address?.billing?.state} - {address?.billing?.postCode}
        </p>
        <p className={style.address}>{address?.billing?.country}</p>
        <p className={style.address}>Phone: {address?.billing?.phone}</p>
      </div>

      {location.pathname === "/my-account/addresses" && (
        <div className={style.addressControllers}>
          <span
            onClick={() => handleUpdateAddress(address)}
            className={style.link}
          >
            <FaEdit className={style.icon} /> Edit
          </span>
          <span className={style.separator}>|</span>
          <span
            onClick={() => handleDeleteAddress(address?._id)}
            className={style.link}
          >
            <FaTrash className={style.icon} /> Delete
          </span>
        </div>
      )}

      {address?.isActive && <span className={style.defaultLabel}>Default</span>}
    </div>
  );
};

export default AddressCard;
