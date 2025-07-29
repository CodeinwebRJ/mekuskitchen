import { createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user_detail");
const userDetail = user ? JSON.parse(user) : {};

const initialState = {
  user: {
    userid: userDetail.userid || "",
    unique_id: userDetail.unique_id || "",
    first_name: userDetail.first_name || "",
    last_name: userDetail.last_name || "",
    mobile: userDetail.mobile || "",
    email: userDetail.email || "",
    refcode: userDetail.refcode || "",
    et_coins: userDetail.et_coins || "",
    user_image: userDetail.user_image || null,
    user_status: userDetail.user_status || "",
  },
  response: "",
  message: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail(state, action) {
      const data = action.payload;
      state.user = {
        userid: data?.userid,
        unique_id: data?.unique_id,
        first_name: data?.first_name,
        last_name: data?.last_name,
        mobile: data?.mobile,
        email: data?.email,
        refcode: data?.refcode,
        et_coins: data?.et_coins,
        user_image: data?.user_image,
        user_status: data?.user_status,
      };
    },
    clearUserDetail(state) {
      state.user = initialState.user;
      state.response = "";
      state.message = "";
    },
  },
});

export const { setUserDetail, clearUserDetail } = userSlice.actions;

export default userSlice.reducer;
