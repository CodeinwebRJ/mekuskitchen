import style from "../../styles/AddressCard.module.css";

const AddressCard = ({
  address,
  handleUpdateAddress,
  handleDeleteAddress,
  handleSetAsDefaultAddress,
}) => {
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
        <h1 className={style.fullName}>
          {address?.billing?.firstName} {address?.billing?.lastName}
        </h1>
        <p className={style.address}>{address?.address}</p>
        <p className={style.city}>
          {address?.billing?.city}, {address?.billing?.state}
        </p>
        <p className={style.state}>
          {address?.billing?.state} - {address?.billing?.postcode}
        </p>
        <p className={style.CountryPostcode}>{address?.billing?.country}</p>
        <p className={style.phoneNumber}>Phone: {address?.billing?.phone}</p>
      </div>

      <div className={style.addressControllers}>
        <span
          onClick={() => {
            handleUpdateAddress(address?._id);
          }}
          className={style.link}
        >
          Edit
        </span>
        <span>|</span>
        <span
          onClick={() => {
            handleDeleteAddress(address?._id);
          }}
          className={style.link}
        >
          Delete
        </span>
      </div>

      {address?.isActive && <span className={style.defaultLabel}>Default</span>}
    </div>
  );
};

export default AddressCard;
