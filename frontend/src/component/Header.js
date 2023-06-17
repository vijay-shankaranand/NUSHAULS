import React, { useState } from 'react'
import logo from "../asset/logo.png"
import { Link } from "react-router-dom"
import {HiOutlineUserCircle} from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [showMenu,setShowMenu] = useState(false);
    const userData = useSelector((state) => state.user);
    const navigate = useNavigate()  
    const dispatch = useDispatch();

    const handleShowMenu = () => {
        setShowMenu(preve => !preve)
    }
  
    const handleLogout = () => {
        dispatch(logoutRedux());
        navigate("/");
        toast("Logout successfully");
      };


    var logoPointer;
    if (userData.role === "student") {
        logoPointer = '/student-home';
    }
    else if (userData.role === "delivery-partner") {
        logoPointer = '/delivery-partner-home';
    }
    else if (userData.role === "seller"){
        logoPointer = '/seller-home';
    } else {
        logoPointer = '/';
    }

  return (
    <header className='fixed shadow-md w-full h-16 px-2 md:px-4 z-50 bg-amber-500'>

        {/* desktop */}

        <div className='flex items-center h-full justify-between'>
                
                <Link to={logoPointer}>
                <div className='h-40'>
                <img src={logo} className="h-full" />
                </div>
                </Link>
            
                <div className="text-slate-600" onClick={handleShowMenu}>
                <div className="text-3xl cursor-pointer w-8 h-8 rounded-full overflow-hidden drop-shadow-md">
                {userData.image ? (
                <img src={userData.image} className="h-full w-full" />
              ) : (
                <HiOutlineUserCircle />
              )}
                </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2  shadow drop-shadow-md flex flex-col min-w-[120px] text-center">
                {userData.role !== '' && (
                  <Link
                    to={"profile"}
                    className="whitespace-nowrap cursor-pointer px-2 hover:bg-slate-200 text-l"
                  >
                    User Profile
                  </Link>
                )}

                {userData.image ? (
                  <p
                    className="cursor-pointer px-2 hover:bg-slate-200 text-l"
                    onClick={handleLogout}
                  >
                    Log Out
                  </p>
                  
                ) : (
                  <Link
                    to={"login"}
                    className="whitespace-nowrap cursor-pointer px-2 hover:bg-slate-200"
                  >
                    Login
                  </Link>
                )}
                
                </div>
            )}
          </div>
        </div>
        {/* mobile */}
    </header>
  )
}

export default Header