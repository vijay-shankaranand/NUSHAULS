import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    orderList:[]
}

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setDataOrder: (state, action) => {
            state.orderList = [...action.payload];
        }
    }
})

export const {
    setDataOrder
} = orderSlice.actions


export default orderSlice.reducer;


