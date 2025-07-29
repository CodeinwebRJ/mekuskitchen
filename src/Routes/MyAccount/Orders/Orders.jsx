import MyAccountContainer from "../MyAccountContainer";
import OrderCard from "../../../Component/Cards/OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { setStatusFilter } from "../../../../Store/Slice/OrderSlice";
import style from "../../../styles/Orders.module.css";
import Pagination from "../../../Component/Pagination";
import NoDataFound from "../../../Component/MainComponents/NoDataFound";
import Loading from "../../../Component/UI-Components/Loading";

const Orders = () => {
  const { Order, statusFilter , loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  return (
    <MyAccountContainer>
      <div className={style.buttonContainer}>
        {["All", "Pending", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() =>
              dispatch(setStatusFilter(status === "All" ? "" : status))
            }
            className={`${style.Button} ${
              statusFilter === (status === "All" ? "" : status)
                ? style.Selected
                : ""
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className={style.orderContainer}>
        {loading ? (
          <Loading />
        ) : Order?.length > 0 ? (
          Order.map((order, i) => <OrderCard key={i} order={order} />)
        ) : (
          <div className="text-gray-600">
            <NoDataFound />
          </div>
        )}
      </div>
      {Order?.pages > 1 && <Pagination />}
    </MyAccountContainer>
  );
};

export default Orders;
