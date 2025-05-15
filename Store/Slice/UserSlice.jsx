import { createSlice } from "@reduxjs/toolkit";
import userDetail from "../../src/Utils/localStorage";

const userData = userDetail || {};

const initialState = {
  isAuthenticated: userData.api_token ? true : false,
  token: userData.api_token ? userData.api_token : "",
  user: {
    userid: userData.userid ? userData.userid : null,
    first_name: userData.first_name ? userData.first_name : null,
    last_name: userData.last_name ? userData.last_name : null,
    unique_id: userData.unique_id ? userData.unique_id : null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.api_token;
      state.user = {
        userid: action.payload.userid,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        unique_id: action.payload.unique_id,
      };
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = "";
      state.user = null;
    },
    setUser(state, action) {
      state.isAuthenticated = Boolean(action.payload.api_token);
      state.token = action.payload.api_token;
      state.user = {
        userid: action.payload.userid,
        first_name: action.payload.first_name,
        last_name: action.payload.last_name,
        unique_id: action.payload.unique_id,
      };
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
