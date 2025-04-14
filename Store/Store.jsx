import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./Slice/ProductSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
  },
});

export default store;
