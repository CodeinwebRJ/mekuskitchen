import { createSlice } from "@reduxjs/toolkit";

const grocerySlice = createSlice({
  name: "products",
  initialState: {
    products: null,
    priceRange: [0, 20],
    grid: 3,
    loading: false,
    page: "1",
    limit: "10",
    search: "",
    sortBy: "sortbylatest",
    category: "grocery",
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
      state.category = action.payload;
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
} = grocerySlice.actions;
export default grocerySlice.reducer;
