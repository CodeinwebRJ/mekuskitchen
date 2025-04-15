import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const UserCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
    },
  },
});

export const { setCart } = UserCartSlice.actions;
export default UserCartSlice.reducer;
