import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    defaultAddress: null,
    showAddressForm: false,
    isEditAddress: false,
  },
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    setDefaultAddress: (state, action) => {
      state.defaultAddress = action.payload;
    },
    setShowAddressForm: (state, action) => {
      state.showAddressForm = action.payload;
    },
    setIsEditAddress: (state, action) => {
      state.isEditAddress = action.payload;
    },
  },
});

export const {
  setAddresses,
  setDefaultAddress,
  setShowAddressForm,
  setIsEditAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
