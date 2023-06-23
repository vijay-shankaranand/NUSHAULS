import logo from "./logo.svg";
import "./App.css";
import Header from "./component/Header";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setDataProduct } from "./redux/productSlice";
import { useSelector } from "react-redux";
import { setDataOrder } from "./redux/orderSlice"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthState } from './redux/userSlice';


function App() {
  const dispatch = useDispatch()
  const productData = useSelector((state)=>state.product)
  const orderData = useSelector((state)=>state.order)
  const userData = useSelector((state)=> state.user)

  console.log(userData)
 
  useEffect(()=>{
    (async()=>{
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/product`)
      const resData = await res.json()
      dispatch(setDataProduct(resData))
    })()
  },[])

  useEffect(()=>{
    (async()=>{
      const res = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/order`)
      const resData = await res.json()
      dispatch(setDataOrder(resData))
    })()
  },[])


  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  

  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
