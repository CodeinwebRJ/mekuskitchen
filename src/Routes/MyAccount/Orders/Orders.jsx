import MyAccountContainer from "../MyAccountContainer";
import OrderCard from "../../../Component/Cards/OrderCard";
import { useEffect } from "react";
import { getUserOrders } from "../../../axiosConfig/AxiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setOrders } from "../../../../Store/Slice/OrderSlice";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const { Order } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  
  const fetchOrders = async () => {
    try {
      dispatch(setLoading(true));
      const data = {
        id: user.userid,
      };
      const res = await getUserOrders(data);
      dispatch(setOrders(res.data.data));
      dispatch(setLoading(false));
    } catch {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <MyAccountContainer>
      {Order?.map((order) => (
        <OrderCard order={order} />
      ))}
    </MyAccountContainer>
  );
};

export default Orders;
