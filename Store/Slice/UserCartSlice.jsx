// src/Store/Slice/UserCartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: {
    items: [], // Array of items: [{ id, price, quantity, productDetails: { product_name, image_url } }, ...]
  },
};

const UserCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set the entire cart (e.g., for syncing with a server)
    setCart(state, action) {
      state.cart = action.payload;
    },
    // Add an item to the cart
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.cart.items.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cart.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    // Remove an item from the cart
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.cart.items = state.cart.items.filter((item) => item.id !== itemId);
    },
    // Update item quantity (increment/decrement)
    updateCartItemQuantity(state, action) {
      const { id, amount } = action.payload; // amount is +1 or -1
      const item = state.cart.items.find((cartItem) => cartItem.id === id);
      if (item) {
        const newQuantity = item.quantity + amount;
        if (newQuantity > 0) {
          item.quantity = newQuantity;
        } else {
          // Remove item if quantity becomes 0 or negative
          state.cart.items = state.cart.items.filter(
            (cartItem) => cartItem.id !== id
          );
        }
      }
    },
    // Clear the cart
    clearCart(state) {
      state.cart.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = UserCartSlice.actions;
export default UserCartSlice.reducer;
