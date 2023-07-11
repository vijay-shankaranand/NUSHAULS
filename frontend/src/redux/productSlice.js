import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productList: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setDataProduct: (state, action) => {
      state.productList = [...action.payload];
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      console.log(productId)
      state.productList = state.productList.filter((product) => product._id !== productId);
    },
  },
});

export const { setDataProduct, deleteProduct } = productSlice.actions;

export default productSlice.reducer;
