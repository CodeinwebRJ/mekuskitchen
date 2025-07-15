import { useSelector } from "react-redux";
import InvoiceCard from "../../../Component/Cards/InvoiceCard";
import MyAccountContainer from "../MyAccountContainer";
import style from "../../../styles/Downloads.module.css";
import Loading from "../../../Component/UI-Components/Loading";
import NoDataFound from "../../../Component/MainComponents/NoDataFound";

const Downloads = () => {
  const { Order, loading } = useSelector((state) => state.order);

  return (
    <MyAccountContainer>
      {loading ? (
        <Loading />
      ) : Order?.length > 0 ? (
        <div className={style.invoiceGrid}>
          {Order?.map((order) => (
            <InvoiceCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <NoDataFound />
      )}
    </MyAccountContainer>
  );
};

export default Downloads;
