import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    userid: "",
    unique_id: "",
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    refcode: "",
    et_coins: "",
    user_image: null,
    user_status: "",
    created_at: "",
    subscription_details: [],
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
