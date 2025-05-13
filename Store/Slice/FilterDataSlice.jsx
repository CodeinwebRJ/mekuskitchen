import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

const FilterDataSlice = createSlice({
  name: "FilterData",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.Category = action.payload;
    },
    setSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },
    setProductCategory: (state, action) => {
      state.ProductCategory = action.payload;
    },
  },
});

export const { setCategory, setSubCategory, setProductCategory } =
  FilterDataSlice.actions;

// Export reducer to configure store
export default FilterDataSlice.reducer;
