import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./page/Login";
import SellerHome from "./page/SellerHome"
import StudentHome from "./page/StudentHome"
import DeliveryPartnerHome from "./page/DeliveryPartnerHome"
import Signup from "./page/Signup";
import LandingPage from "./page/LandingPage"
import { store } from "./redux/index";
import { Provider } from "react-redux";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      
      {/* <Route path="menu" element={<Menu />} /> */}
      <Route path="signup" element={<Signup />} />
      <Route path="student-home" element={<StudentHome />} />
      <Route path="delivery-partner-home" element={<DeliveryPartnerHome />} />
      <Route path="seller-home" element={<SellerHome />} />
      <Route path="login" element={<Login />} />
    
     
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




