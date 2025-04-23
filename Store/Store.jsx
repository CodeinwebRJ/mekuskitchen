import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./Slice/ProductSlice";
import authSlice from "../Store/Slice/UserSlice";
import TiffinSlice from "../Store/Slice/TiffinSlice";
import UserCartSlice from "../Store/Slice/UserCartSlice";
import addressSlice from "../Store/Slice/AddressSlice";
import CountSlice from "../Store/Slice/CountSlice";
import UserWishlistSlice from "../Store/Slice/UserWishlistSlice";

const store = configureStore({
  reducer: {
    product: productSlice,
    auth: authSlice,
    tiffin: TiffinSlice,
    cart: UserCartSlice,
    address: addressSlice,
    count: CountSlice,
    wishlist: UserWishlistSlice,
  },
});

export default store;
