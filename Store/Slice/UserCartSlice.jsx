import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const UserCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
  },
});

export const { setCart } = UserCartSlice.actions;

export default UserCartSlice.reducer;
