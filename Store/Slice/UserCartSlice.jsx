import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
};

const UserCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    setCartLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setCart, setCartLoading } = UserCartSlice.actions;

export default UserCartSlice.reducer;
