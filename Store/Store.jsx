import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./Slice/ProductSlice";
import authSlice from "../Store/Slice/UserSlice";
import TiffinSlice from "../Store/Slice/TiffinSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authSlice,
    tiffin: TiffinSlice,
  },
});

export default store;
