import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import productSliceReducer from "./productSlice";
import orderSliceReducer from "./orderSlice";
import notificationSliceReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    user : userSliceReducer,
    product : productSliceReducer,
    order : orderSliceReducer,
    notification: notificationSliceReducer
    
  },
});
