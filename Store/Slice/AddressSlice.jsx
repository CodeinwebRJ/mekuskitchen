import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    defaultAddress: null,
    showAddressForm: false,
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
    deleteAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter(
        (address) => address._id !== addressId
      );
      if (state.defaultAddress?._id === addressId) {
        state.defaultAddress = null;
      }
    },
  },
});

export const {
  setAddresses,
  setDefaultAddress,
  setShowAddressForm,
  deleteAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
