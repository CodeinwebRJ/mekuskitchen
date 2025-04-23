import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  likedMap: {},
};

const userWishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.items = action.payload;
      const map = {};
      action.payload?.items?.forEach((item) => {
        if (item.productId && item.productId._id) {
          map[item.productId._id] = true;
        }
      });
      state.likedMap = map;
    },
    toggleLiked(state, action) {
      const productId = action.payload;
      if (state.likedMap[productId]) {
        delete state.likedMap[productId];
      } else {
        state.likedMap[productId] = true;
      }
    },
  },
});

export const { setWishlist, toggleLiked } = userWishlistSlice.actions;

export default userWishlistSlice.reducer;
