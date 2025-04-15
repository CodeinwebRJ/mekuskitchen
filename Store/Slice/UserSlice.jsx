import { createSlice } from "@reduxjs/toolkit";
import userDetail from "../../src/Utils/localStorage";

const userData = userDetail || {};

console.log(userDetail)

const initialState = {
  isAuthenticated: Boolean(userData.api_token),
  token: userData.api_token || null,
  user: {
    userid: userDetail?.userid,
    first_name: userDetail?.first_name,
    last_name: userDetail?.last_name,
    unique_id: userDetail?.unique_id,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    setUser(state, action) {
      state.isAuthenticated = Boolean(action.payload.token);
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
