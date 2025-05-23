import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  likedMap: {},
};

const userWishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // In userWishlistSlice
    setWishlist(state, action) {
      const payloadItems = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.items || [];
      state.items = payloadItems;
      const map = {};
      payloadItems.forEach((item) => {
        const productId = item._id || item;
        if (productId) {
          map[productId] = true;
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
