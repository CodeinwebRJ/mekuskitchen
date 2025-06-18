import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countriesData: [],
};

const CountrySlice = createSlice({
  name: 'CountrySlice',
  initialState,
  reducers: {
    setCountriesData: (state, action) => {
      state.countriesData = action.payload;
    },
  },
});

export const { setCountriesData } = CountrySlice.actions;
export default CountrySlice.reducer;
