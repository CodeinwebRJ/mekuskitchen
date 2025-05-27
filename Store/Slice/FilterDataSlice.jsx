import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Categorys: [],
  subCategory: [],
  ProductCategory: [],
  brand: [],
};

const FilterDataSlice = createSlice({
  name: "FilterData",
  initialState,
  reducers: {
    setCategorys: (state, action) => {
      state.Categorys = action.payload;
    },
    setSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },
    setProductCategory: (state, action) => {
      state.ProductCategory = action.payload;
    },
  },
});

export const { setCategorys, setSubCategory, setProductCategory } =
  FilterDataSlice.actions;

// Export reducer to configure store
export default FilterDataSlice.reducer;
