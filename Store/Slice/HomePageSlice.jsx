import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const HomePageSlice = createSlice({
  name: "filterData",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = HomePageSlice.actions;

export default HomePageSlice.reducer;
