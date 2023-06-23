import React, { useState } from "react";
import loginSignupImage from "../asset/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";

function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        image: ""
    });
    
    
    const handleShowPassword = () => {
        setShowPassword((preve) => !preve);
    };
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword((preve) => !preve);
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => {
            return {
                ...preve,
                [name]: value,
            };
        });
    };


    const handleUploadProfileImage = async (e) => {
        if (e.target.files[0]) {
        const data = await ImagetoBase64(e.target.files[0])


        setData((preve) => {
            return {
                ...preve,
                image: data
            }
        })
    }

    }
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, email, password, confirmPassword, role , image } = data;
        if (role === 'student' && email.substring(email.lastIndexOf('@')) !== '@u.nus.edu') {
            toast("You have selected STUDENT role. Please input your NUS email!")
        } else {
        if (firstName && email && password && confirmPassword && role && image) {
            if (password === confirmPassword) {

                const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/signup`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                })

                const dataRes = await fetchData.json()


                toast(dataRes.message)
                if (dataRes.alert) {
                    navigate("/login");
                }

            } else {
                toast("Password & Confirm Password Do Not Match");
            }
        } else {
            toast("Please Enter Required Fields!");
        }
    }
    };

    return (
        <div className="p-10 md:p-10">
            <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4">
                {/* <h1 className='text-center text-2xl font-bold'>Sign up</h1> */}
                <div className="w-40 h-40 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative ">
                    <img src={data.image ? data.image : loginSignupImage} className="w-full h-full" alt=""/>

                    <label htmlFor="profileImage">
                        <div className="absolute bottom-0 h-1/3  bg-slate-500 bg-opacity-50 w-full text-center cursor-pointer">
                            <p className="p-2 text-white">Upload</p>
                        </div>
                        <input type={"file"} id="profileImage" accept="image/*" className="hidden" onChange={handleUploadProfileImage} />
                    </label>
                </div>

                <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type={"text"}
                        id="firstName"
                        name="firstName"
                        className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                        value={data.firstName}
                        onChange={handleOnChange}
                    />

                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type={"text"}
                        id="lastName"
                        name="lastName"
                        className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-blue-300"
                        value={data.lastName}
                        onChange={handleOnChange}
                    />

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

                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2  focus-within:outline focus-within:outline-blue-300">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmpassword"
                            name="confirmPassword"
                            className=" w-full bg-slate-200 border-none outline-none "
                            value={data.confirmPassword}
                            onChange={handleOnChange}
                        />
                        <span
                            className="flex text-xl cursor-pointer"
                            onClick={handleShowConfirmPassword}
                        >
                            {showConfirmPassword ? <BiShow /> : <BiHide />}
                        </span>
                    </div>

                    <label for="role">Role</label>
                    <select className="flex px-2 py-2 bg-slate-200 rounded mt-1 mb-2  focus-within:outline focus-within:outline-blue-300"
                        id="role"
                        name="role"
                        value={data.role}
                        onChange={handleOnChange}>
                        <option value="" selected disabled>Please select</option>
                        <option value="student">Student</option>
                        <option value="seller">Seller</option>
                        <option value="delivery-partner">Delivery Partner</option>
                    </select>


                    <button className="w-full max-w-[150px] m-auto  bg-amber-500 hover:bg-blue-800 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
                        Sign up
                    </button>
                </form>
                <p className="text-left text-sm mt-2">
                    Already have an account?{" "}
                    <Link to={"/login"} className="text-amber-500 underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;