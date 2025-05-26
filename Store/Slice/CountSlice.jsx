import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
  wishlistCount: 0,
};

const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    setWishlistCount(state, action) {
      state.wishlistCount = action.payload;
    },
  },
});

export const { setCartCount, setWishlistCount } = countSlice.actions;

export default countSlice.reducer;
