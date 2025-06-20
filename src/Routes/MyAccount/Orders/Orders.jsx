import MyAccountContainer from "../MyAccountContainer";
import OrderCard from "../../../Component/Cards/OrderCard";
import { useEffect, useState } from "react";
import { getUserOrders } from "../../../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setOrders } from "../../../../Store/Slice/OrderSlice";
import style from "../../../styles/Orders.module.css";
import Pagination from "../../../Component/Pagination";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const { Order } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async (status) => {
    try {
      dispatch(setLoading(true));
      const data = {
        id: user.userid,
        orderStatus: status, 
      };
      const res = await getUserOrders(data);
      dispatch(setOrders(res.data.data));
    } catch (error) {
      console.log("Fetch Orders Error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  return (
    <MyAccountContainer>
      <div className={style.buttonContainer}>
        {["All", "Pending", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status === "All" ? "" : status)}
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
        {Order?.length > 0 ? (
          Order.map((order, i) => <OrderCard key={i} order={order} />)
        ) : (
          <p className="text-gray-600">No orders found.</p>
        )}
      </div>

      <Pagination />
    </MyAccountContainer>
  );
};

export default Orders;
