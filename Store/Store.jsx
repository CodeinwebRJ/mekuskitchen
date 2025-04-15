import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./Slice/ProductSlice";
import authSlice from "../Store/Slice/UserSlice";
import TiffinSlice from "../Store/Slice/TiffinSlice";
import UserCartSlice from "../Store/Slice/UserCartSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authSlice,
    tiffin: TiffinSlice,
    cart: UserCartSlice,
  },
});

export default store;
