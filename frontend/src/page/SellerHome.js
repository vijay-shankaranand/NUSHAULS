import React, { useState } from "react";
import loginSignupImage from "../asset/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";
import Homecard from "../component/Homecard"
import { useSelector } from "react-redux";

const SellerHome = () => {
  const productData = useSelector((state=>state.product.productList))
  const homeProductCartList = productData
  const userData = useSelector((state) => state.user);
  console.log(userData._id)
  console.log(homeProductCartList.filter((product) => product.user === userData._id))
  
  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Your <span className="text-amber-500">Products</span></h2>
          </div>
          <div className="flex p-10">
            <Link to="/newproduct">
            <button className="absolute right-20 bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">+ New Product</button>
					  </Link>
          </div>
					<div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            homeProductCartList[0] && homeProductCartList.filter((product) => product.user === userData._id).map(el => {
              return (
                <Homecard
                key={el._id}
                id={el._id}
                image={el.image}
                name={el.name}
                price={el.price}
                category={el.category}
                />
              )
            })
          }
        </div>
          
				</div>
  )
}

export default SellerHome