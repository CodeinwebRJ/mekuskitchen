import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: null,
    priceRange: [0, 20],
    grid: 3,
    loading: false,
    page: "1",
    limit: "9",
    search: "",
    sortBy: "",
    category: "electronics",
    subCategory: "",
    ProductCategory: "",
    combinations: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = [0, action.payload];
    },
    setGrid: (state, action) => {
      state.grid = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload.toLowerCase();
    },
    setSubCategory: (state, action) => {
      state.subCategory = action.payload.toLowerCase();
    },
    setProductCategory: (state, action) => {
      state.ProductCategory = action.payload.toLowerCase();
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
  setPriceRange,
  setGrid,
  setLoading,
  setPage,
  setLimit,
  setSearch,
  setSortBy,
  setCategory,
  setSubCategory,
  setProductCategory,
  setCombinations,
} = productSlice.actions;

export default productSlice.reducer;
