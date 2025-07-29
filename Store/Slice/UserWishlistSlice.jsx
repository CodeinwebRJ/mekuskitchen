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
      const items = Array.isArray(action.payload)
        ? action.payload
        : action.payload?.items || [];

      state.items = items;

      state.likedMap = items.reduce((acc, item) => {
        const id = item._id || item;
        if (id) acc[id] = true;
        return acc;
      }, {});
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
