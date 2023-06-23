import {useLocation, Navigate, Outlet} from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { useSelector } from "react-redux";

const RequireAuth = ({ allowedRole }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const localData = localStorage.getItem("authState")
    console.log(localData)

    const { _id, role } = JSON.parse(localData || "{}");


    return (
        (auth?.role === allowedRole) || (role === allowedRole)
        ? <Outlet/>
        : (auth?.user) || (_id)
        ? <Navigate to="/unauthorised" state={{ from: location }} replace/>
        : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default RequireAuth