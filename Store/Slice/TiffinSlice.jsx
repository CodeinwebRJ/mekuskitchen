import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tiffins: [],
  loading: true,
};

const TiffinSlice = createSlice({
  name: "tiffin",
  initialState,
  reducers: {
    setTiffins(state, action) {
      state.tiffins = action.payload;
    },
    setTiffinLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setTiffins, setTiffinLoading } = TiffinSlice.actions;

export default TiffinSlice.reducer;
