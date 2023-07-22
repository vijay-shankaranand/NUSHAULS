import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    notificationList:[]
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setDataNotification: (state, action) => {
            state.notificationList = [...action.payload];
        }
    }
})

export const {
    setDataNotification
} = notificationSlice.actions


export default notificationSlice.reducer;