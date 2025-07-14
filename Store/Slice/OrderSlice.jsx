import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "Order",
  initialState: {
    Order: [],
    loading: false,
    statusFilter: "",
  },
  reducers: {
    setOrders: (state, action) => {
      state.Order = action.payload;
    },
    setOrderLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
});

export const { setOrders, setOrderLoading, setStatusFilter } = OrderSlice.actions;

export default OrderSlice.reducer;
