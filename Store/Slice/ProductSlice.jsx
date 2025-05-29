import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: null,
    loading: false,
    combinations: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCombinations: (state, action) => {
      state.combinations = [];
      action.payload.forEach((product) => {
        product.sku.forEach((sku) => {
          const combinations = sku.details?.combinations;
          combinations?.forEach((combination) => {
            state.combinations.push(combination);
          });
        });
      });
    },
  },
});

export const {
  setProducts,
  setLoading,
  setCombinations,
} = productSlice.actions;

export default productSlice.reducer;
