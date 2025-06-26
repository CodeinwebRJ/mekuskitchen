// src/hooks/useFilterActions.js

import { useDispatch, useSelector } from "react-redux";
import {
  setSearch,
  setPage,
  setCategories,
  setSubCategories,
  setProductCategories,
  setBrands,
  setRatings,
  setAttributes,
  resetFilters,
  setPrices,
} from "../../Store/Slice/FilterDataSlice";

export const useFilterActions = () => {
  const dispatch = useDispatch();
  const filterData = useSelector((state) => state.filterData);

  const updateSearch = (value) => {
    dispatch(setSearch(value));
    dispatch(setPage(1));
  };

  const updateCategories = (categories) => {
    dispatch(setCategories(categories));
    dispatch(setPage(1));
  };

  const updateSubCategories = (subCategories) => {
    dispatch(setSubCategories(subCategories));
    dispatch(setPage(1));
  };

  const updateProductCategories = (productCategories) => {
    dispatch(setProductCategories(productCategories));
    dispatch(setPage(1));
  };

  const updateBrands = (brands) => {
    dispatch(setBrands(brands));
    dispatch(setPage(1));
  };

  const updateRatings = (ratings) => {
    dispatch(setRatings(ratings));
    dispatch(setPage(1));
  };

  const updateAttributes = (attributes) => {
    dispatch(setAttributes(attributes));
    dispatch(setPage(1));
  };

  const updatePrices = (prices) => {
    dispatch(setPrices(prices));
  };

  const clearAllFilters = () => {
    dispatch(resetFilters());
    dispatch(setPage(1));
  };

  return {
    filterData,
    updateSearch,
    updateCategories,
    updateSubCategories,
    updateProductCategories,
    updateBrands,
    updateRatings,
    updateAttributes,
    updatePrices,
    clearAllFilters,
  };
};
