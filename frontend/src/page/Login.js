import React, { useState } from "react";
import loginSignupImage from "../asset/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import { loginRedux } from "../redux/userSlice";
import useAuth from "../hooks/useAuth";



const Login = () => {
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate() 
  const dispatch = useDispatch()


  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };

  const handleOnChange = (e)=>{
    const {name,value} = e.target
    setData((preve)=>{
        return{
            ...preve,
            [name] : value
        }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const {email,password} = data
    if(email && password ){
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/login`,{
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(data)
      })

      const dataRes = await fetchData.json()
      
      
      toast(dataRes.message)
      
      if(dataRes.alert){
        
        dispatch(loginRedux(dataRes))
        setTimeout(() => {
          const user = dataRes.data._id
          const pwd = dataRes.data.password
          const role = dataRes.data.role
          setAuth({ user, pwd, role });
          if (dataRes.data.role === 'student') {
            navigate("/student-home")
          }
          else if (dataRes.data.role === 'delivery-partner') {
            navigate("/delivery-partner-home")
          }
          else {
            navigate("/seller-home")
          }
          
        }, 1000);
        
      }

      
    }
    else{
        alert("Please Enter required fields")
    }
  }

  return (
    <div>
    <div className="p-20 md:p-20">
    <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4">
      {/* <h1 className='text-center text-2xl font-bold'>Sign up</h1> */}
      <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto">
        <img src={loginSignupImage} className="w-full" alt=""/>
      </div>

      <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type={"email"}
          id="email"
          name="email"
          className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
          value={data.email}
          onChange={handleOnChange}

        />

        <label htmlFor="password">Password</label>
        <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className=" w-full bg-slate-200 border-none outline-none "
            value={data.password}
            onChange={handleOnChange}
          />
          <span
            className="flex text-xl cursor-pointer"
            onClick={handleShowPassword}
          >
            {showPassword ? <BiShow /> : <BiHide />}
          </span>
        </div>

        <button className="w-full max-w-[150px] m-auto  bg-amber-500 hover:bg-blue-800 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
          Login
        </button>
      </form>
      <p className="text-left text-sm mt-2">
        Don't  have account ?{" "}
        <Link to={"/signup"} className="text-amber-500 underline">
          Sign Up
        </Link>
      </p>
    </div>
  </div>
  <div className="text-center">
  <span className="text-red-500 pl-2">* </span>Kindly remember to fill in your role specific details under <span className="font-bold">My Profile</span> before beginning any transaction!
  </div>
  </div>
  )
}

export default Login