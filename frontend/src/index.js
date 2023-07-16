import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import SellerHome from "./page/SellerHome";
import StudentHome from "./page/StudentHome";
import DeliveryPartnerHome from "./page/DeliveryPartnerHome";
import Signup from "./page/Signup";
import LandingPage from "./page/LandingPage";
import EmailVerify from "./page/EmailVerify";
import { store } from "./redux/index";
import { Provider } from "react-redux";
import ProfileSeller from "./page/ProfileSeller";
import ProfileDp from "./page/ProfileDp.js";
import ProfileStudent from "./page/ProfileStudent";
import Newproduct from "./page/Newproduct";
import Myorders from "./page/Myorders";
import Product from "./page/Product";
import ProductSeller from "./page/ProductSeller";
import Myjobs from "./page/Myjobs";
import { AuthProvider } from './context/AuthProvider';
import Unauthorised from "./page/Unauthorised";
import Missing from "./page/Missing";
import RequireAuth from "./component/RequireAuth";



const AppRouter = () => {
  

return (
  <BrowserRouter>
<AuthProvider>
<Routes>

<Route path="/" element={<App />}>
{ /* public routes */}
<Route index element={<LandingPage />} />
<Route path="signup" element={<Signup />} />
<Route path="login" element={<Login />} />
<Route path="unauthorised" element={<Unauthorised/>}/>
<Route path="/index/:id/verify/:token" element={<EmailVerify />} />

      
{ /* seller routes */}

      <Route element={<RequireAuth allowedRole="seller"/>}>
      <Route path="seller-home" element={<SellerHome />} />
        <Route path="newproduct" element={<Newproduct />} />
        <Route path="product-seller/:filterby" element={<ProductSeller />} />
        <Route path="profile-seller/:id" element={<ProfileSeller />} />
        </Route>


{ /* student routes */}
<Route element={<RequireAuth allowedRole="student"/>}>
        <Route path="student-home" element={<StudentHome />} />
        <Route path="product/:filterby" element={<Product />} />
        <Route path="myorders" element={<Myorders />} />
        <Route path="profile-student/:id" element={<ProfileStudent />} />
        </Route>

        { /* delivery-partner routes */}
        <Route element={<RequireAuth allowedRole="delivery-partner"/>}>
        <Route path="delivery-partner-home" element={<DeliveryPartnerHome />} />
        <Route path="myjobs" element={<Myjobs />} />
        <Route path="profile-dp/:id" element={<ProfileDp />} />
        </Route>
        

        { /* incorrect routes */}
        <Route path="*" element={<Missing/>} />

        
</Route>
    </Routes>
</AuthProvider>
</BrowserRouter>

);
};

ReactDOM.render(
<Provider store={store}>
<AppRouter />
</Provider>,
document.getElementById("root")
);

reportWebVitals();



