import { configureStore } from "@reduxjs/toolkit";
import foodSlice from "./Slice/FoodSlice";
import grocerySlice from "./Slice/GrocerySlice";

const store = configureStore({
  reducer: {
    food: foodSlice,
    grocery: grocerySlice,
  },
});

export default store;
