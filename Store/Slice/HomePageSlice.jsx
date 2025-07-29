import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  loading: false,
};

const HomePageSlice = createSlice({
  name: "filterData",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setHomeLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setData, setHomeLoading } = HomePageSlice.actions;

export default HomePageSlice.reducer;
