import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "Order",
  initialState: {
    Order: [],
    loading: false,
  },
  reducers: {
    setOrders: (state, action) => {
      state.Order = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setOrders, setLoading } = OrderSlice.actions;

export default OrderSlice.reducer;
