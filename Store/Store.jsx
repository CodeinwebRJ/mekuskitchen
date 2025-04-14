import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./Slice/ProductSlice";
import userSlice from "../Store/Slice/UserSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    auth: userSlice,
  },
});

export default store;
