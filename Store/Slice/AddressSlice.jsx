import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    defaultAddress: null,
    showAddressForm: false,
    selfPickup: false,
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
    setSelfPickup: (state, action) => {
      state.selfPickup = action.payload;
      state.defaultAddress = null;
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
  setSelfPickup,
} = addressSlice.actions;

export default addressSlice.reducer;
