import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tiffins: [],
};

const TiffinSlice = createSlice({
  name: "tiffin",
  initialState,
  reducers: {
    setTiffins(state, action) {
      state.tiffins = action.payload;
    },
  },
});

export const { setTiffins } = TiffinSlice.actions;

export default TiffinSlice.reducer;
