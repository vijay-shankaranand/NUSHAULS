import React, { useState } from 'react';
import logo from "../asset/logo.png";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleShowMenu = () => {
    setShowMenu(prev => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutRedux());
    navigate("/");
    toast("Logout successfully");
  };

  var logoPointer;
  if (userData.role === "student") {
    logoPointer = '/student-home';
  } else if (userData.role === "delivery-partner") {
    logoPointer = '/delivery-partner-home';
  } else if (userData.role === "seller") {
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
            <img src={logo} className="h-full" alt="Logo" />
          </div>
        </Link>
        <div className="flex items-center gap-4 md:gap-7">
          {userData.role === 'delivery-partner' && (
            <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
              <Link to={"/delivery-partner-home"}>Home</Link>
              <Link to={"/myjobs"}>My Jobs</Link>
            </nav>
          )}
          {userData.role === 'seller' && (
            <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
              <Link to={"/seller-home"}>Home</Link>
            </nav>
          )}
      
          {userData.role === 'student' && (
            <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
              <Link to={"/student-home"}>Home</Link>
              <Link to={"/myorders"}>My Orders</Link>
            </nav>
          )}
          <div className="text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" alt="User Avatar" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2 top-14 shadow drop-shadow-md flex flex-col min-w-[120px] text-center">
                {userData.role === 'student' && (
                  <Link
                    to={`profile-student/${userData._id}`}
                    className="whitespace-nowrap cursor-pointer px-2 hover:bg-slate-200 text-l"
                  >
                    My Profile
                  </Link>
                )}
                {userData.role === 'delivery-partner' && (
                  <Link
                    to={`profile-dp/${userData._id}`}
                    className="whitespace-nowrap cursor-pointer px-2 hover:bg-slate-200 text-l"
                  >
                    My Profile
                  </Link>
                )}
                {userData.role === 'seller' && (
                  <Link
                    to={`profile-seller/${userData._id}`}
                    className="whitespace-nowrap cursor-pointer px-2 hover:bg-slate-200 text-l"
                  >
                    My Profile
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
      </div>
      {/* mobile */}
    </header>
  );
};

export default Header;
