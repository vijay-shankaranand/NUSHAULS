import React, { useState, useEffect } from 'react';
import logo from "../asset/logo.png";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle, HiOutlineBell } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setDataNotification } from "../redux/notificationSlice";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const userData = useSelector((state) => state.user);
  const notificationData = useSelector((state) => state.notification.notificationList.slice().reverse());
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notificationFilterStudent = notificationData.filter(notification => notification.studentId === userData._id)
  .filter(notification => notification.studentViewed === false)

  const notificationFilterSeller = notificationData.filter(notification => notification.sellerId === userData._id)
  .filter(notification => notification.sellerViewed === false)
  
  useEffect(() => {
    // Fetch product data asynchronously
    if (userData.role === "student" || userData.role === "seller") {
    const fetchNotificationData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/notification`);
        const data = await response.json();
        dispatch(setDataNotification(data)); // Dispatch action to update product data in the Redux store
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    fetchNotificationData();
}}, [dispatch]);
  
  const handleShowMenu = () => {
    setShowMenu(prev => !prev);
  };

  

  const handleShowNotification = () => {
    const id = userData._id
    if (showNotification === false) {

      fetch(`${process.env.REACT_APP_SERVER_DOMIN}/updateNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      })
      .then(response => response.json())
      .then(data => {
              
       })
      .catch(error => {
              
        console.error(error);
      });
      
      setShowNotification(prev => !prev)
      setNotificationCount((prevCount) => prevCount + 1);

    } else {
      
      setShowNotification(prev => !prev)
      
    }
    
  }

  const handleLogout = () => {
    dispatch(logoutRedux());
    setNotificationCount(0);
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
              <Link to={"/delivery-partner-home"}>Job Marketplace</Link>
              <Link to={"/myjobs"}>My Jobs</Link>
            </nav>
          )}
          {userData.role === 'seller' && (
            <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
              <Link to={"/seller-home"}>My Products</Link>
            </nav>
          )}
      
          {userData.role === 'student' && (
            <nav className="gap-4 md:gap-6 text-base md:text-lg hidden md:flex">
              <Link to={"/student-home"}>Market Place</Link>
              <Link to={"/myorders"}>My Orders</Link>
            </nav>
          )}
          {(userData.role === "student") &&
          <div className="text-slate-600" onClick={handleShowNotification}>
          <div className="text-3xl cursor-pointer relative w-7 rounded-full drop-shadow-md">
            
          {notificationFilterStudent.length > 0 && notificationCount === 0 && (
  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
    {notificationFilterStudent.length}
  </div>
  
)}

              
                <HiOutlineBell /> 
              
            </div>
            </div>
}
{(userData.role === "seller") &&
          <div className="text-slate-600" onClick={handleShowNotification}>
          <div className="text-3xl cursor-pointer relative w-7 rounded-full drop-shadow-md">
            
          {notificationFilterSeller.length > 0 && notificationCount === 0 && (
  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
    {notificationFilterSeller.length}
  </div>
  
)}

              
                <HiOutlineBell /> 
              
            </div>
            </div>
}
          <div className="text-slate-600" onClick={handleShowMenu}>
            <div className="text-3xl cursor-pointer w-8 rounded-full overflow-hidden drop-shadow-md">
              {userData.image ? (
                <img src={userData.image} className="h-full w-full" alt="User Avatar" />
              ) : (
                <HiOutlineUserCircle />
              )}
            </div>
            {showMenu && (
              <div className="absolute right-2 bg-white py-2 top-14 shadow drop-shadow-md flex flex-col min-w-[120px] text-center rounded">
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
            {showNotification && userData.role === "student" && (
          <div className="absolute right-16 bg-white py-2 top-14 shadow drop-shadow-md flex flex-col min-w-[120px] text-wrap p-5 pt-5 pb-5 rounded w-[400px]">
            <div className="h-48 overflow-y-auto">
            {(notificationFilterStudent.length === 0) ? (
              <div>No new notifications</div>
            ) : (
              notificationFilterStudent.map((notification, index) => {
                if (notification.sellerId === "delivered") {
                return(
                    <React.Fragment key={notification.id}>
                      {index !== 0 && <hr className="my-2" />}
                      <p className="text-sm break-normal">
                        Your order for <span className="font-bold">{notification.productName}</span> has been delivered to you successfully! (Order ID : {notification.orderId})
                      </p>
                    </React.Fragment>
                )
                } else {
                  return(
                    <React.Fragment key={notification.id}>
                      {index !== 0 && <hr className="my-2" />}
                      <p className="text-sm break-normal">
                        Your order for <span className="font-bold">{notification.productName}</span> has been accepted by a delivery partner! (Order ID : {notification.orderId})
                      </p>
                    </React.Fragment>
                )
                }
              })
            )}
          </div>
          </div>
        )}
        {showNotification && userData.role === "seller" && (
          <div className="absolute right-16 bg-white py-2 top-14 shadow drop-shadow-md flex flex-col min-w-[120px] text-wrap p-5 pt-5 pb-5 rounded w-[400px]">
            <div className="h-40 overflow-y-auto">
            {(notificationFilterSeller.length === 0) ? (
              <div>No new notifications</div>
            ) : (
              notificationFilterSeller.map((notification, index) => {
                return(
                    <React.Fragment key={notification.id}>
                      {index !== 0 && <hr className="my-2" />}
                      <p className="text-sm break-normal">
                      An order of your product: <span className="font-bold">{notification.productName}</span> has been accepted by a delivery partner. Please prepare item for pick up for time-slot : <span className="font-bold">{notification.timeSlot}</span>. (product ID: {notification.productId})
                      </p>
                    </React.Fragment>
                )
              })
            )}
          </div>
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
